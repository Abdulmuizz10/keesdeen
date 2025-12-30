import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import {
  Users,
  Shield,
  Search,
  Filter,
  Check,
  Mail,
  Calendar,
  Key,
  Globe,
  Pencil,
  Trash2,
  Eye,
} from "lucide-react";

import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import axiosInstance from "@/lib/axiosConfig";

// Types
interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  isAdmin: boolean;
  authMethod: "password" | "google";
  createdAt: string;
  updatedAt: string;
}

const StatCard = ({ title, value, icon: Icon }: any) => (
  <div className="bg-card border border-border p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-3xl font-light tracking-tight mt-2">{value}</p>
      </div>
      <div className={`p-3 rounded-full bg-muted`}>
        <Icon className={`h-5 w-5 text-muted-foreground`} />
      </div>
    </div>
  </div>
);

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [authFilter, setAuthFilter] = useState("All");

  // Dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Edit form state
  const [editForm, setEditForm] = useState({
    isAdmin: false,
  });

  // Stats calculation
  const stats = {
    total: users?.length || 0,
    admins: users?.filter((u) => u.isAdmin).length || 0,
    googleAuth: users?.filter((u) => u.authMethod === "google").length || 0,
    passwordAuth: users?.filter((u) => u.authMethod === "password").length || 0,
  };

  const fetchData = async (page: number) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `/users/admin/pagination-users?page=${page}`
      );
      if (response.status === 200) {
        setUsers(response.data.users);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setEditForm({
      isAdmin: user.isAdmin,
    });
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;

    setLoading(true);
    try {
      // Update role if changed
      if (editForm.isAdmin !== selectedUser.isAdmin) {
        const response = await axiosInstance.patch(
          `/users/admin/${selectedUser._id}/role`,
          { isAdmin: editForm.isAdmin },
          {
            validateStatus: (status: any) => status < 600,
          }
        );
        if (response.status === 200) {
          toast.success(response.data.message);
        } else {
          toast.error(response.data.message || "Something went wrong");
        }
      }

      setEditDialogOpen(false);
      fetchData(currentPage);
    } catch (error) {
      toast.error("Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    setLoading(true);
    try {
      const response = await axiosInstance.delete(
        `/users/admin/${selectedUser._id}/delete-user`
      );

      if (response.status === 200) {
        toast.success("User deleted successfully");
        setDeleteDialogOpen(false);
        fetchData(currentPage);
      }
    } catch (error) {
      toast.error("Failed to delete user");
    } finally {
      setLoading(false);
    }
  };

  // Filter users
  useEffect(() => {
    let filtered = [...users];

    if (searchQuery) {
      filtered = filtered.filter(
        (user) =>
          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user._id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (roleFilter !== "All") {
      if (roleFilter === "Admin") {
        filtered = filtered.filter((user) => user.isAdmin);
      } else if (roleFilter === "User") {
        filtered = filtered.filter((user) => !user.isAdmin);
      }
    }

    if (authFilter !== "All") {
      filtered = filtered.filter(
        (user) => user.authMethod === authFilter.toLowerCase()
      );
    }

    setFilteredUsers(filtered);
  }, [searchQuery, roleFilter, authFilter, users]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getRoleBadge = (isAdmin: boolean) => {
    return (
      <span
        className={`inline-flex items-center justify-center  text-xs font-medium ${
          isAdmin ? "text-green-300" : "text-muted-foreground"
        }`}
      >
        {isAdmin ? "Admin" : "Customer"}
      </span>
    );
  };

  const getAuthBadge = (authMethod: string) => {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium ${
          authMethod === "google" ? "text-blue-300" : "text-green-300"
        }`}
      >
        {authMethod === "google" ? (
          <>
            <Globe className="h-3 w-3" />
            Google
          </>
        ) : (
          <>
            <Key className="h-3 w-3" />
            Password
          </>
        )}
      </span>
    );
  };

  return (
    <div className="flex-1 space-y-4 p-4 bg-background">
      {/* HEADER */}
      <div className="mb-5 border-b border-border pb-8">
        <h1 className="text-2xl lg:text-5xl font-light tracking-tight mb-3">
          Users Management
        </h1>
        <p className="text-sm text-muted-foreground">
          View and manage all registered users
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Users" value={stats.total} icon={Users} />
        <StatCard
          title="Administrators"
          value={stats.admins}
          icon={Shield}
          status="admin"
        />
        <StatCard
          title="Google Auth"
          value={stats.googleAuth}
          icon={Globe}
          status="google"
        />
        <StatCard
          title="Password Auth"
          value={stats.passwordAuth}
          icon={Key}
          status="password"
        />
      </div>

      {/* Filters */}
      <div className="bg-card border border-border p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name, email, or user ID..."
              className="w-full pl-10 pr-4 py-2.5 bg-background border border-input text-sm focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Role Filter */}
          <div className="relative">
            <DropdownMenu>
              <DropdownMenuTrigger className="w-full">
                <div className="relative flex items-center gap-2 pl-10 pr-8 py-2.5 bg-background border border-input text-sm cursor-pointer min-w-[150px]">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <span>{roleFilter}</span>
                </div>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-48 ml-4 rounded-none">
                {["All", "Admin", "User"].map((role) => (
                  <DropdownMenuItem
                    key={role}
                    onClick={() => setRoleFilter(role)}
                    className="flex items-center justify-between"
                  >
                    {role}
                    {roleFilter === role && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Auth Method Filter */}
          <div className="relative">
            <DropdownMenu>
              <DropdownMenuTrigger className="w-full">
                <div className="relative flex items-center gap-2 pl-10 pr-8 py-2.5 bg-background border border-input text-sm cursor-pointer min-w-[150px]">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <span>{authFilter}</span>
                </div>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-48 ml-4 rounded-none">
                {["All", "Google", "Password"].map((auth) => (
                  <DropdownMenuItem
                    key={auth}
                    onClick={() => setAuthFilter(auth)}
                    className="flex items-center justify-between"
                  >
                    {auth}
                    {authFilter === auth && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-card border border-border">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Spinner className="size-6" />
          </div>
        ) : !filteredUsers || filteredUsers.length === 0 ? (
          <div className="text-center py-24">
            <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg text-muted-foreground">No users found</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border">
                  <tr>
                    <th className="text-left p-6 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                      User
                    </th>
                    <th className="text-left p-6 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                      Email
                    </th>
                    <th className="text-left p-6 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                      Role
                    </th>
                    <th className="text-left p-6 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                      Auth Method
                    </th>
                    <th className="text-left p-6 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                      Joined Date
                    </th>
                    <th className="text-left p-6 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, index) => (
                    <tr
                      key={user._id}
                      className={`border-b border-border hover:bg-muted/50 transition-colors ${
                        index === filteredUsers.length - 1 ? "border-b-0" : ""
                      }`}
                    >
                      <td className="p-6">
                        <Link
                          to={`/admin/customers/customer_details/${user._id}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                              <span className="text-sm font-medium">
                                {user.firstName.charAt(0).toUpperCase()}
                                {user.lastName.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <div className="text-sm font-medium">
                                {user.firstName} {user.lastName}
                              </div>
                              <div className="text-xs text-muted-foreground font-mono">
                                ID: {user._id.slice(-8).toUpperCase()}
                              </div>
                            </div>
                          </div>
                        </Link>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{user.email}</span>
                        </div>
                      </td>
                      <td className="p-6">{getRoleBadge(user.isAdmin)}</td>
                      <td className="p-6">{getAuthBadge(user.authMethod)}</td>
                      <td className="p-6">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {formatDate(user.createdAt)}
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditClick(user)}
                            className="p-2 hover:bg-muted rounded transition-colors"
                            title="Update role"
                          >
                            <Pencil className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(user)}
                            className="p-2 hover:bg-muted rounded transition-colors"
                            title="Delete user"
                          >
                            <Trash2 className="h-4 w-4 text-muted-foreground hover:text-red-600" />
                          </button>
                          <Link
                            to={`/admin/customers/customer_details/${user._id}`}
                          >
                            <button
                              className="p-2 hover:bg-muted rounded transition-colors"
                              title="View details"
                            >
                              <Eye className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                            </button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden divide-y divide-border">
              {filteredUsers.map((user) => (
                <div
                  key={user._id}
                  className="p-6 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium">
                        {user.firstName.charAt(0).toUpperCase()}
                        {user.lastName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium mb-1">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-xs text-muted-foreground mb-2">
                        {user.email}
                      </div>
                      <div className="flex items-center gap-2">
                        {getRoleBadge(user.isAdmin)}
                        {getAuthBadge(user.authMethod)}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs pt-3 border-t border-border">
                      <span className="text-muted-foreground">User ID:</span>
                      <span className="font-mono">
                        {user._id.slice(-12).toUpperCase()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Joined:</span>
                      <span>{formatDate(user.createdAt)}</span>
                    </div>

                    <div className="flex items-center gap-2 pt-3 border-t border-border">
                      <button
                        onClick={() => handleEditClick(user)}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 text-sm bg-background border border-border hover:bg-muted transition-colors"
                      >
                        <Pencil className="h-4 w-4" />
                        Update
                      </button>
                      <button
                        onClick={() => handleDeleteClick(user)}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 text-sm bg-background border text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                      <Link
                        to={`/admin/users/user_details/${user._id}`}
                        className="flex-1"
                      >
                        <button className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-sm bg-foreground text-background hover:bg-foreground/90 transition-colors">
                          <Eye className="h-4 w-4" />
                          View
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Pagination */}
        {!loading && filteredUsers && filteredUsers.length > 0 && (
          <div className="mt-16 flex items-center justify-between border-t border-border pt-8 px-6 pb-6">
            <button
              className={`text-sm uppercase tracking-widest transition-colors ${
                currentPage === 1
                  ? "cursor-not-allowed text-muted-foreground"
                  : "text-foreground hover:text-muted-foreground"
              }`}
              disabled={currentPage === 1}
              onClick={() => {
                setCurrentPage((prev) => Math.max(prev - 1, 1));
                window.scrollTo({ top: 0, behavior: "instant" });
              }}
            >
              Previous
            </button>
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className={`text-sm uppercase tracking-widest transition-colors ${
                currentPage === totalPages
                  ? "cursor-not-allowed text-muted-foreground"
                  : "text-foreground hover:text-muted-foreground"
              }`}
              disabled={currentPage === totalPages}
              onClick={() => {
                setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                window.scrollTo({ top: 0, behavior: "instant" });
              }}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px] text-foreground">
          <DialogHeader>
            <DialogTitle className="text-foreground text-xl font-light tracking-tight">
              Update User Role
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Update role for {selectedUser?.firstName} {selectedUser?.lastName}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4 text-foreground">
            <div className="flex items-center justify-between">
              <div>
                <Label
                  htmlFor="isAdmin"
                  className="text-sm font-medium text-foreground"
                >
                  Administrator Access
                </Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Grant full admin panel access
                </p>
              </div>
              <Switch
                id="isAdmin"
                checked={editForm.isAdmin}
                onCheckedChange={(checked) =>
                  setEditForm({ ...editForm, isAdmin: checked })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <button
              type="button"
              onClick={() => setEditDialogOpen(false)}
              className="px-4 py-2 text-sm border border-border text-foreground hover:bg-muted transition-colors"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleUpdateUser}
              className="px-4 py-2 text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Update User
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px] text-foreground">
          <DialogHeader>
            <DialogTitle className="text-foreground text-xl font-light tracking-tight">
              Delete User
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Are you sure you want to delete "{selectedUser?.firstName}{" "}
              {selectedUser?.lastName}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <button
              type="button"
              onClick={() => setDeleteDialogOpen(false)}
              className="px-4 py-2 text-sm border border-border text-foreground hover:bg-muted transition-colors"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleDeleteUser}
              className="px-4 py-2 text-sm bg-red-600 text-white hover:bg-red-700 transition-colors"
            >
              Delete User
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUsers;
