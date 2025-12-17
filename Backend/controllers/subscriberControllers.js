import SubscriberModel from "../models/subscriberModel.js";
import EmailCampaignModel from "../models/emailCampaignModel.js";
import { sendSubscribersEmail } from "../lib/utils.js";

const createSubscriber = async (req, res) => {
  const { email } = req.body;
  try {
    const existingSubscriber = await SubscriberModel.findOne({
      email: email,
    });

    if (existingSubscriber) {
      if (existingSubscriber.status === "unsubscribed") {
        // Resubscribe
        existingSubscriber.status = "active";
        existingSubscriber.subscribedAt = new Date();
        existingSubscriber.unsubscribedAt = null;
        await existingSubscriber.save();
        return res
          .status(200)
          .json({ message: "Welcome back! You've been resubscribed." });
      }
      return res.status(400).json({ message: "You've already subscribed!" });
    }

    const subscriber = new SubscriberModel({
      email: email,
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
      source: req.body.source || "footer_form",
    });

    await subscriber.save();

    res.status(200).json({ message: "Thanks for subscribing!" });
  } catch (error) {
    console.error("Subscribe error:", error);
    res.status(500).json({ message: "Something went wrong!" });
  }
};

const unSubscribeByToken = async (req, res) => {
  try {
    const { token } = req.params;
    const subscriber = await SubscriberModel.findOne({
      unsubscribeToken: token,
    });

    if (!subscriber) {
      return res.status(404).json({ message: "Invalid unsubscribe link" });
    }

    if (subscriber.status === "unsubscribed") {
      return res.status(200).json({ message: "You're already unsubscribed" });
    }

    await subscriber.unsubscribe();
    res.status(200).json({ message: "Successfully unsubscribed" });
  } catch (error) {
    console.error("Unsubscribe error:", error);
    res.status(500).json({ message: "Failed to unsubscribe" });
  }
};

const adminGetAllSubscribers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      status = "all",
      search = "",
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const query = {};

    if (status !== "all") {
      query.status = status;
    }

    if (search) {
      query.email = { $regex: search, $options: "i" };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions = { [sortBy]: sortOrder === "desc" ? -1 : 1 };

    const [subscribers, total] = await Promise.all([
      SubscriberModel.find(query)
        .sort(sortOptions)
        .limit(parseInt(limit))
        .skip(skip)
        .lean(),
      SubscriberModel.countDocuments(query),
    ]);

    // Get statistics
    const stats = await SubscriberModel.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const statistics = {
      total,
      active: stats.find((s) => s._id === "active")?.count || 0,
      unsubscribed: stats.find((s) => s._id === "unsubscribed")?.count || 0,
      bounced: stats.find((s) => s._id === "bounced")?.count || 0,
    };

    res.status(200).json({
      subscribers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
      statistics,
    });
  } catch (error) {
    console.error("Get subscribers error:", error);
    res.status(500).json({ message: "Unable to get subscribers" });
  }
};

const adminDeleteSubscriber = async (req, res) => {
  try {
    const { id } = req.params;
    await SubscriberModel.findByIdAndDelete(id);
    res.status(200).json({ message: "Subscriber deleted successfully" });
  } catch (error) {
    console.error("Delete subscriber error:", error);
    res.status(500).json({ message: "Failed to delete subscriber" });
  }
};

const adminCreateEmailCampaign = async (req, res) => {
  const { subject, message, image, tags, scheduledFor } = req.body;

  try {
    const campaign = new EmailCampaignModel({
      subject,
      message,
      image,
      tags: tags || [],
      scheduledFor: scheduledFor ? new Date(scheduledFor) : null,
      status: scheduledFor ? "scheduled" : "draft",
      createdBy: req.user?._id, // if you have auth
    });

    await campaign.save();
    res
      .status(201)
      .json({ message: "Campaign created successfully", campaign });
  } catch (error) {
    console.error("Create campaign error:", error);
    res.status(500).json({ message: "Failed to create campaign" });
  }
};

const adminSendEmailCampaign = async (req, res) => {
  const { campaignId } = req.params;
  try {
    const campaign = await EmailCampaignModel.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }
    if (campaign.status === "sent") {
      return res.status(400).json({ message: "Campaign already sent" });
    }

    campaign.status = "sending";
    await campaign.save();

    const activeSubscribers = await SubscriberModel.getActive();
    if (activeSubscribers.length === 0) {
      campaign.status = "failed";
      await campaign.save();
      return res.status(400).json({ message: "No active subscribers" });
    }

    campaign.recipientCount = activeSubscribers.length;

    // Send emails individually with unique tokens
    try {
      let successCount = 0;
      let failedCount = 0;

      // Send email to each subscriber with their unique token
      const emailPromises = activeSubscribers.map((subscriber) =>
        sendSubscribersEmail(
          subscriber.email,
          campaign.subject,
          campaign.message,
          campaign.image,
          subscriber.unsubscribeToken // Pass unique token for each subscriber
        )
          .then(() => {
            successCount++;
            return { success: true, email: subscriber.email };
          })
          .catch((error) => {
            failedCount++;
            console.error(
              `Failed to send email to ${subscriber.email}:`,
              error
            );
            return { success: false, email: subscriber.email, error };
          })
      );

      await Promise.all(emailPromises);

      // Update campaign status
      campaign.status = successCount > 0 ? "sent" : "failed";
      campaign.sentAt = new Date();
      campaign.deliveredCount = successCount;
      campaign.failedCount = failedCount;
      await campaign.save();

      // Update subscriber stats (only for successful sends)
      if (successCount > 0) {
        await SubscriberModel.updateMany(
          { status: "active" },
          {
            $inc: { emailsSent: 1 },
            $set: { lastEmailSentAt: new Date() },
          }
        );
      }

      res.status(200).json({
        message: `Campaign sent! ${successCount} delivered, ${failedCount} failed`,
        recipientCount: activeSubscribers.length,
        deliveredCount: successCount,
        failedCount: failedCount,
      });
    } catch (emailError) {
      campaign.status = "failed";
      campaign.failedCount = activeSubscribers.length;
      await campaign.save();
      throw emailError;
    }
  } catch (error) {
    console.error("Send campaign error:", error);
    res.status(500).json({ message: "Failed to send campaign" });
  }
};

const adminGetAllCampaigns = async (req, res) => {
  try {
    const { page = 1, limit = 20, status = "all" } = req.query;

    const query = status !== "all" ? { status } : {};
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [campaigns, total] = await Promise.all([
      EmailCampaignModel.find(query)
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip(skip)
        .lean(),
      EmailCampaignModel.countDocuments(query),
    ]);

    res.status(200).json({
      campaigns,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Get campaigns error:", error);
    res.status(500).json({ message: "Unable to get campaigns" });
  }
};

const adminGetCampaignAnalytics = async (req, res) => {
  try {
    const totalCampaigns = await EmailCampaignModel.countDocuments();
    const totalSent = await EmailCampaignModel.countDocuments({
      status: "sent",
    });

    const aggregateStats = await EmailCampaignModel.aggregate([
      { $match: { status: "sent" } },
      {
        $group: {
          _id: null,
          totalRecipients: { $sum: "$recipientCount" },
          totalDelivered: { $sum: "$deliveredCount" },
          totalOpened: { $sum: "$openedCount" },
          totalClicked: { $sum: "$clickedCount" },
          totalFailed: { $sum: "$failedCount" },
        },
      },
    ]);

    const stats = aggregateStats[0] || {
      totalRecipients: 0,
      totalDelivered: 0,
      totalOpened: 0,
      totalClicked: 0,
      totalFailed: 0,
    };

    const openRate =
      stats.totalDelivered > 0
        ? ((stats.totalOpened / stats.totalDelivered) * 100).toFixed(2)
        : 0;

    const clickRate =
      stats.totalDelivered > 0
        ? ((stats.totalClicked / stats.totalDelivered) * 100).toFixed(2)
        : 0;

    res.status(200).json({
      totalCampaigns,
      totalSent,
      ...stats,
      openRate: parseFloat(openRate),
      clickRate: parseFloat(clickRate),
    });
  } catch (error) {
    console.error("Get analytics error:", error);
    res.status(500).json({ message: "Unable to get analytics" });
  }
};

export {
  createSubscriber,
  unSubscribeByToken,
  adminGetAllSubscribers,
  adminDeleteSubscriber,
  adminCreateEmailCampaign,
  adminSendEmailCampaign,
  adminGetAllCampaigns,
  adminGetCampaignAnalytics,
};
