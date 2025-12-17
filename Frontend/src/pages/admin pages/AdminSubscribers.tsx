import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Mail,
  Users,
  Send,
  Trash2,
  Search,
  TrendingUp,
  Eye,
  MousePointer,
  XCircle,
  CheckCircle,
  Clock,
  Image,
  X,
} from "lucide-react";
import Axios from "axios";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { URL } from "@/lib/constants";

// Types
interface Subscriber {
  _id: string;
  email: string;
  status: "active" | "unsubscribed" | "bounced";
  createdAt: string;
  emailsSent?: number;
  emailsOpened?: number;
}

interface SubscriberStats {
  total: number;
  active: number;
  unsubscribed: number;
  bounced: number;
}

interface Pagination {
  pages: number;
}

interface Campaign {
  _id: string;
  subject: string;
  status: "sent" | "draft" | "scheduled" | "sending" | "failed";
  recipientCount?: number;
  deliveredCount?: number;
  openedCount?: number;
  clickedCount?: number;
  sentAt?: string;
  createdAt?: string;
}

interface Analytics {
  totalCampaigns: number;
  totalSent: number;
  totalRecipients: number;
  totalDelivered: number;
  openRate: number;
  clickRate: number;
}

interface NewCampaign {
  subject: string;
  message: string;
  image: File | string | null;
  imagePreview: string | null;
}

interface DeleteDialog {
  open: boolean;
  id: string | null;
  email: string;
}

interface SendDialog {
  open: boolean;
  id: string | null;
  subject: string;
}

const AdminSubscribers: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [subscriberStats, setSubscriberStats] = useState<SubscriberStats>({
    total: 0,
    active: 0,
    unsubscribed: 0,
    bounced: 0,
  });
  const [subscriberSearch, setSubscriberSearch] = useState("");
  const [subscriberFilter, setSubscriberFilter] = useState("all");
  const [subscriberPage, setSubscriberPage] = useState(1);
  const [subscriberPagination, setSubscriberPagination] = useState<Pagination>({
    pages: 1,
  });
  const [loadingSubscribers, setLoadingSubscribers] = useState(false);

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [campaignPage, setCampaignPage] = useState(1);
  const [campaignPagination, setCampaignPagination] = useState<Pagination>({
    pages: 1,
  });
  const [loadingCampaigns, setLoadingCampaigns] = useState(false);

  const [analytics, setAnalytics] = useState<Analytics>({
    totalCampaigns: 0,
    totalSent: 0,
    totalRecipients: 0,
    totalDelivered: 0,
    openRate: 0,
    clickRate: 0,
  });

  const [newCampaign, setNewCampaign] = useState<NewCampaign>({
    subject: "",
    message: "",
    image: null,
    imagePreview: null,
  });

  const [creatingCampaign, setCreatingCampaign] = useState(false);
  const [sendingCampaign, setSendingCampaign] = useState(false);

  const [deleteDialog, setDeleteDialog] = useState<DeleteDialog>({
    open: false,
    id: null,
    email: "",
  });

  const [sendDialog, setSendDialog] = useState<SendDialog>({
    open: false,
    id: null,
    subject: "",
  });

  const fetchSubscribers = async () => {
    setLoadingSubscribers(true);
    try {
      const res = await Axios.get(
        `${URL}/subscribers/admin/get-all-subscribers?page=${subscriberPage}&status=${subscriberFilter}&search=${subscriberSearch}`,
        { withCredentials: true }
      );
      setSubscribers(res.data.subscribers || []);
      setSubscriberStats(res.data.statistics);
      setSubscriberPagination(res.data.pagination);
    } catch {
      toast.error("Failed to fetch subscribers");
    } finally {
      setLoadingSubscribers(false);
    }
  };

  const fetchCampaigns = async () => {
    setLoadingCampaigns(true);
    try {
      const res = await Axios.get(
        `${URL}/subscribers/admin/campaigns/get-all-campaigns?page=${campaignPage}`,
        { withCredentials: true }
      );
      setCampaigns(res.data.campaigns);
      setCampaignPagination(res.data.pagination);
    } catch {
      toast.error("Failed to fetch campaigns");
    } finally {
      setLoadingCampaigns(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const res = await Axios.get(
        `${URL}/subscribers/admin/campaigns/analytics`,
        { withCredentials: true }
      );
      setAnalytics(res.data);
    } catch {
      toast.error("Failed to fetch analytics");
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, [subscriberPage, subscriberFilter, subscriberSearch]);

  useEffect(() => {
    if (activeTab === "campaigns") fetchCampaigns();
    if (activeTab === "overview") fetchAnalytics();
  }, [activeTab, campaignPage]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setNewCampaign((prev) => ({
      ...prev,
      image: file,
      imagePreview: window.URL.createObjectURL(file),
    }));

    uploadToCloudinary(file);
  };

  const uploadToCloudinary = async (file: File) => {
    const form = new FormData();
    form.append("file", file);
    form.append("upload_preset", import.meta.env.VITE_CLOUDINARY_PRESET);
    form.append("folder", "campaign_images");

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${
          import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
        }/image/upload`,
        { method: "POST", body: form }
      );
      const data = await res.json();
      setNewCampaign((prev) => ({ ...prev, image: data.secure_url }));
      toast.success("Image uploaded");
    } catch {
      toast.error("Upload failed");
    }
  };

  const removeImage = () => {
    setNewCampaign({ ...newCampaign, image: null, imagePreview: null });
  };

  const handleCreateCampaign = async () => {
    setCreatingCampaign(true);
    try {
      await Axios.post(
        `${URL}/subscribers/admin/campaigns/create-campaign`,
        {
          subject: newCampaign.subject,
          message: newCampaign.message,
          image: newCampaign.image,
        },
        { withCredentials: true }
      );
      toast.success("Campaign created");
      fetchCampaigns();
      setNewCampaign({
        subject: "",
        message: "",
        image: null,
        imagePreview: null,
      });
    } catch {
      toast.error("Failed to create campaign");
    } finally {
      setCreatingCampaign(false);
    }
  };

  const handleSendCampaign = async () => {
    if (!sendDialog.id) return;

    setSendingCampaign(true);
    try {
      await Axios.post(
        `${URL}/subscribers/admin/campaigns/${sendDialog.id}/send`,
        {},
        { withCredentials: true }
      );
      toast.success("Campaign sent");
      fetchCampaigns();
    } catch {
      toast.error("Failed to send campaign");
    } finally {
      setSendingCampaign(false);
      setSendDialog({ open: false, id: null, subject: "" });
    }
  };

  const handleDeleteSubscriber = async () => {
    try {
      await Axios.delete(
        `${URL}/subscribers/admin/${deleteDialog.id}/delete-subscriber`,
        { withCredentials: true }
      );
      toast.success("Subscriber deleted");
      fetchSubscribers();
    } catch {
      toast.error("Failed to delete subscriber");
    } finally {
      setDeleteDialog({ open: false, id: null, email: "" });
    }
  };

  const getStatusBadge = (status: string) => (
    <Badge
      variant="outline"
      className="uppercase tracking-widest border-none text-green-300"
    >
      {status}
    </Badge>
  );

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <div className="p-4 space-y-4">
      {/* HEADER */}
      <div className="mb-5 border-b border-border pb-8">
        <h1 className="text-2xl lg:text-5xl font-light tracking-tight mb-3">
          Subscribers Management
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage your subscribers and email campaigns
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-4 lg:w-auto h-full rounded-none">
          <TabsTrigger value="overview" className="p-3 rounded-none">
            Overview
          </TabsTrigger>
          <TabsTrigger value="subscribers" className="p-3 rounded-none">
            Subscribers
          </TabsTrigger>
          <TabsTrigger value="campaigns" className="p-3 rounded-none">
            Campaigns
          </TabsTrigger>
          <TabsTrigger value="create" className="p-3 rounded-none">
            Create Campaign
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-border rounded-none">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>
                  <p className="text-xs uppercase text-muted-foreground tracking-wider">
                    Total Subscribers
                  </p>
                </CardTitle>
                <div className="rounded-full bg-muted p-3 border flex items-center justify-center">
                  <Users
                    size={20}
                    className="text-accent-foreground"
                    strokeWidth={1.5}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-light">
                  {subscriberStats.total}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {subscriberStats.active} active
                </p>
              </CardContent>
            </Card>

            <Card className="border-border rounded-none">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>
                  <p className="text-xs uppercase text-muted-foreground tracking-wider">
                    Campaigns Sent
                  </p>
                </CardTitle>
                <div className="rounded-full bg-muted p-3 border flex items-center justify-center">
                  <Send
                    size={20}
                    className="text-accent-foreground"
                    strokeWidth={1.5}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-light">{analytics.totalSent}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {analytics.totalCampaigns} total campaigns
                </p>
              </CardContent>
            </Card>

            <Card className="border-border rounded-none">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>
                  <p className="text-xs uppercase text-muted-foreground tracking-wider">
                    Open Rate
                  </p>
                </CardTitle>
                <div className="rounded-full bg-muted p-3 border flex items-center justify-center">
                  <Eye
                    size={20}
                    className="text-accent-foreground"
                    strokeWidth={1.5}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-light">{analytics.openRate}%</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Average across campaigns
                </p>
              </CardContent>
            </Card>

            <Card className="border-border rounded-none">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>
                  <p className="text-xs uppercase text-muted-foreground tracking-wider">
                    Click Rate
                  </p>
                </CardTitle>
                <div className="rounded-full bg-muted p-3 border flex items-center justify-center">
                  <MousePointer
                    size={20}
                    className="text-accent-foreground"
                    strokeWidth={1.5}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-light">
                  {analytics.clickRate}%
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Average across campaigns
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-border rounded-none">
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl font-light tracking-tight">
                Subscriber Growth
              </CardTitle>
              <CardDescription>
                Overview of your subscriber base
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle
                      size={20}
                      className="text-green-600"
                      strokeWidth={1.5}
                    />
                    <span className="text-sm">Active</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {subscriberStats.active}
                    </span>
                    <div className="h-2 w-32 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-600 rounded-full"
                        style={{
                          width: `${
                            (subscriberStats.active / subscriberStats.total) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <XCircle
                      size={20}
                      className="text-muted-foreground"
                      strokeWidth={1.5}
                    />
                    <span className="text-sm">Unsubscribed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {subscriberStats.unsubscribed}
                    </span>
                    <div className="h-2 w-32 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gray-600 rounded-full"
                        style={{
                          width: `${
                            (subscriberStats.unsubscribed /
                              subscriberStats.total) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp
                      size={20}
                      className="text-red-600"
                      strokeWidth={1.5}
                    />
                    <span className="text-sm">Bounced</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {subscriberStats.bounced}
                    </span>
                    <div className="h-2 w-32 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-red-600 rounded-full"
                        style={{
                          width: `${
                            (subscriberStats.bounced / subscriberStats.total) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscribers" className="space-y-6">
          <Card className="border-border rounded-none">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl md:text-3xl font-light tracking-tight">
                    All Subscribers
                  </CardTitle>
                  <CardDescription>Manage your subscriber list</CardDescription>
                </div>
                <div className="flex gap-2">
                  <div className="relative flex-1 flex items-center sm:w-64">
                    <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search emails..."
                      value={subscriberSearch}
                      onChange={(e) => setSubscriberSearch(e.target.value)}
                      className="pl-8 rounded-none py-5 focus:outline-none"
                    />
                  </div>
                  <Select
                    value={subscriberFilter}
                    onValueChange={setSubscriberFilter}
                  >
                    <SelectTrigger className="w-32 rounded-none py-5 focus:outline-none">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-none">
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="unsubscribed">Unsubscribed</SelectItem>
                      <SelectItem value="bounced">Bounced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loadingSubscribers ? (
                <div className="flex items-center justify-center py-24">
                  <Spinner className="size-6" />
                </div>
              ) : subscribers.length === 0 ? (
                <div className="text-center py-24">
                  <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg text-muted-foreground">
                    No subscribers found
                  </p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="border-b border-border">
                        <tr>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                            Email
                          </th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                            Status
                          </th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                            Joined
                          </th>
                          <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                            Emails Sent
                          </th>
                          <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                            Opened
                          </th>
                          <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {subscribers.map((subscriber, index) => (
                          <tr
                            key={subscriber._id}
                            className={`border-b border-border hover:bg-muted/50 transition-colors ${
                              index === subscribers.length - 1
                                ? "border-b-0"
                                : ""
                            }`}
                          >
                            <td className="py-3 px-4 font-medium">
                              {subscriber.email}
                            </td>
                            <td className="py-3 px-4">
                              {getStatusBadge(subscriber.status)}
                            </td>
                            <td className="py-3 px-4 text-sm">
                              {formatDate(subscriber.createdAt)}
                            </td>
                            <td className="py-3 px-4 text-right text-sm">
                              {subscriber.emailsSent || 0}
                            </td>
                            <td className="py-3 px-4 text-right text-sm">
                              {subscriber.emailsOpened || 0}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  setDeleteDialog({
                                    open: true,
                                    id: subscriber._id,
                                    email: subscriber.email,
                                  })
                                }
                              >
                                <Trash2 className="h-4 w-4 text-red-600" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {subscriberPagination.pages > 1 && (
                    <div className="mt-16 flex items-center justify-between border-t border-border pt-8">
                      <button
                        className={`text-sm uppercase tracking-widest transition-colors ${
                          subscriberPage === 1
                            ? "cursor-not-allowed text-muted-foreground"
                            : "text-foreground hover:text-muted-foreground"
                        }`}
                        disabled={subscriberPage === 1}
                        onClick={() => {
                          setSubscriberPage((p) => Math.max(1, p - 1));
                          window.scrollTo({ top: 0, behavior: "instant" });
                        }}
                      >
                        Previous
                      </button>
                      <span className="text-sm text-muted-foreground">
                        Page {subscriberPage} of {subscriberPagination.pages}
                      </span>
                      <button
                        className={`text-sm uppercase tracking-widest transition-colors ${
                          subscriberPage === subscriberPagination.pages
                            ? "cursor-not-allowed text-muted-foreground"
                            : "text-foreground hover:text-muted-foreground"
                        }`}
                        disabled={subscriberPage === subscriberPagination.pages}
                        onClick={() => {
                          setSubscriberPage((p) =>
                            Math.min(subscriberPagination.pages, p + 1)
                          );
                          window.scrollTo({ top: 0, behavior: "instant" });
                        }}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-6">
          <Card className="border-border rounded-none">
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl font-light tracking-tight">
                Email Campaigns
              </CardTitle>
              <CardDescription>View and manage your campaigns</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingCampaigns ? (
                <div className="flex items-center justify-center py-24">
                  <Spinner className="size-6" />
                </div>
              ) : campaigns.length === 0 ? (
                <div className="text-center py-24">
                  <Mail className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg text-muted-foreground">
                    No campaigns yet. Create your first campaign!
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    {campaigns.map((campaign, index) => (
                      <div
                        key={campaign._id}
                        className={`border border-border rounded-none p-4 hover:bg-muted/50 transition-colors ${
                          index === campaigns.length - 1 ? "" : ""
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3>
                                <span>{campaign.subject}</span>
                              </h3>
                              {getStatusBadge(campaign.status)}
                            </div>

                            {campaign.status === "sent" && (
                              <div className="flex items-center gap-6 text-sm text-muted-foreground mt-3">
                                <div className="flex items-center gap-1">
                                  <Users className="h-4 w-4" />
                                  <span>{campaign.recipientCount} sent</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Eye className="h-4 w-4" />
                                  <span>{campaign.openedCount} opened</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <MousePointer className="h-4 w-4" />
                                  <span>{campaign.clickedCount} clicked</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  <span>{formatDate(campaign.sentAt!)}</span>
                                </div>
                              </div>
                            )}

                            {campaign.status === "draft" && (
                              <p className="text-sm text-muted-foreground mt-1">
                                Created {formatDate(campaign.createdAt!)}
                              </p>
                            )}
                          </div>

                          {campaign.status === "draft" && (
                            <Button
                              size="sm"
                              onClick={() =>
                                setSendDialog({
                                  open: true,
                                  id: campaign._id,
                                  subject: campaign.subject,
                                })
                              }
                              disabled={sendingCampaign}
                              className="rounded-none py-5 px-6"
                            >
                              <Send className="h-4 w-4 mr-2" />
                              Send Now
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {campaignPagination.pages > 1 && (
                    <div className="mt-16 flex items-center justify-between border-t border-border pt-8">
                      <button
                        className={`text-sm uppercase tracking-widest transition-colors ${
                          campaignPage === 1
                            ? "cursor-not-allowed text-muted-foreground"
                            : "text-foreground hover:text-muted-foreground"
                        }`}
                        disabled={campaignPage === 1}
                        onClick={() => {
                          setCampaignPage((p) => Math.max(1, p - 1));
                          window.scrollTo({ top: 0, behavior: "instant" });
                        }}
                      >
                        Previous
                      </button>
                      <span className="text-sm text-muted-foreground">
                        Page {campaignPage} of {campaignPagination.pages}
                      </span>
                      <button
                        className={`text-sm uppercase tracking-widest transition-colors ${
                          campaignPage === campaignPagination.pages
                            ? "cursor-not-allowed text-muted-foreground"
                            : "text-foreground hover:text-muted-foreground"
                        }`}
                        disabled={campaignPage === campaignPagination.pages}
                        onClick={() => {
                          setCampaignPage((p) =>
                            Math.min(campaignPagination.pages, p + 1)
                          );
                          window.scrollTo({ top: 0, behavior: "instant" });
                        }}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create" className="space-y-6">
          <Card className="border-border rounded-none">
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl font-light tracking-tight">
                Create New Campaign
              </CardTitle>
              <CardDescription>
                Compose your email to send to all active subscribers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Subject Line</label>
                  <Input
                    placeholder="Enter email subject..."
                    value={newCampaign.subject}
                    onChange={(e) =>
                      setNewCampaign({
                        ...newCampaign,
                        subject: e.target.value,
                      })
                    }
                    className="rounded-none py-6"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Message</label>
                  <Textarea
                    placeholder="Write your email message here..."
                    value={newCampaign.message}
                    onChange={(e) =>
                      setNewCampaign({
                        ...newCampaign,
                        message: e.target.value,
                      })
                    }
                    rows={10}
                    className="resize-none rounded-none py-2"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Image (Optional)
                  </label>
                  {newCampaign.imagePreview ? (
                    <div className="relative border border-border rounded-none p-4">
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 p-1 bg-background rounded-full shadow-sm hover:bg-muted"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <img
                        src={newCampaign.imagePreview}
                        alt="Campaign preview"
                        className="max-h-64 mx-auto rounded-none"
                      />
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-border rounded-none p-8 text-center">
                      <Image className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <label className="cursor-pointer">
                        <span className="text-sm text-muted-foreground">
                          Click to upload or drag and drop
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                      <p className="text-xs text-muted-foreground mt-2">
                        PNG, JPG, GIF up to 5MB
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleCreateCampaign}
                    disabled={
                      creatingCampaign ||
                      !newCampaign.subject ||
                      !newCampaign.message
                    }
                    className="flex-1 rounded-none py-6"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    {creatingCampaign ? "Creating..." : "Save as Draft"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() =>
                      setNewCampaign({
                        subject: "",
                        message: "",
                        image: null,
                        imagePreview: null,
                      })
                    }
                    className="flex-1 rounded-none py-6"
                  >
                    Clear
                  </Button>
                </div>

                <div className="bg-muted border border-border rounded-none p-4">
                  <p className="text-sm text-muted-foreground">
                    <strong>Note:</strong> This will create a draft campaign.
                    You can review and send it from the Campaigns tab.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AlertDialog
        open={sendDialog.open}
        onOpenChange={(open) => setSendDialog((s) => ({ ...s, open }))}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground text-xl font-light tracking-tight">
              Send Campaign
            </AlertDialogTitle>
            <AlertDialogDescription>
              Send <strong>{sendDialog.subject}</strong> to all active
              subscribers?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-none px-4 py-2 text-sm border border-border text-foreground hover:bg-muted transition-colors">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSendCampaign}
              disabled={sendingCampaign}
              className="rounded-none"
            >
              {sendingCampaign ? "Sending..." : "Send Campaign"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* DELETE SUBSCRIBER DIALOG */}
      <AlertDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog((d) => ({ ...d, open }))}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground text-xl font-light tracking-tight">
              Delete Subscriber
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Are you sure you want to delete{" "}
              <strong>{deleteDialog.email}</strong>? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="px-4 py-2 text-sm border border-border text-foreground hover:bg-muted transition-colors rounded-none">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteSubscriber}
              className="px-4 py-2 text-sm bg-red-600 text-white hover:bg-red-700 transition-colors rounded-none"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminSubscribers;
