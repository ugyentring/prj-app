import { useEffect, useState } from "react";
import useUpdateUserProfile from "../../hooks/useUpdateUserProfile";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const EditProfileModal = ({ authUser }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    bio: "",
    link: "",
    newPassword: "",
    currentPassword: "",
  });

  const { updateProfile, isUpdatingProfile } = useUpdateUserProfile();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (authUser) {
      setFormData({
        fullName: authUser.fullName,
        username: authUser.username,
        email: authUser.email,
        bio: authUser.bio,
        link: authUser.link,
        newPassword: "",
        currentPassword: "",
      });
    }
  }, [authUser]);

  return (
    <>
      <button
        className="btn btn-outline rounded-full btn-sm"
        onClick={() =>
          document.getElementById("edit_profile_modal").showModal()
        }
        style={{ backgroundColor: "#006400", color: "#ffffff", border: "none", padding: "8px 16px", borderRadius: "9999px", cursor: "pointer" }}
      >
        Edit profile
      </button>
      <dialog id="edit_profile_modal" className="modal">
        <div className="modal-box bg-white border rounded-md border-gray-300 shadow-md p-6">
          <div className="flex justify-end">
            <button
              className="btn btn-clear"
              onClick={() =>
                document.getElementById("edit_profile_modal").close()
              }
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
          <h3 className="font-bold text-lg mb-4">Update Profile</h3>
          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              updateProfile(formData);
            }}
          >
            <div className="flex flex-wrap gap-4">
              <input
                type="text"
                placeholder="Full Name"
                className="input w-full border border-gray-300 rounded p-2"
                value={formData.fullName}
                name="fullName"
                onChange={handleInputChange}
              />
              <input
                type="text"
                placeholder="Username"
                className="input w-full border border-gray-300 rounded p-2"
                value={formData.username}
                name="username"
                onChange={handleInputChange}
              />
            </div>
            <div className="flex flex-wrap gap-4">
              <input
                type="email"
                placeholder="Email"
                className="input w-full border border-gray-300 rounded p-2"
                value={formData.email}
                name="email"
                onChange={handleInputChange}
              />
              <textarea
                placeholder="Bio"
                className="input w-full border border-gray-300 rounded p-2"
                value={formData.bio}
                name="bio"
                onChange={handleInputChange}
              />
            </div>
            <div className="flex flex-wrap gap-4">
              <input
                type="password"
                placeholder="Current Password"
                className="input w-full border border-gray-300 rounded p-2"
                value={formData.currentPassword}
                name="currentPassword"
                onChange={handleInputChange}
              />
              <input
                type="password"
                placeholder="New Password"
                className="input w-full border border-gray-300 rounded p-2"
                value={formData.newPassword}
                name="newPassword"
                onChange={handleInputChange}
              />
            </div>
            <input
              type="text"
              placeholder="Link"
              className="input w-full border border-gray-300 rounded p-2"
              value={formData.link}
              name="link"
              onChange={handleInputChange}
            />
            <button
              className="btn rounded-full btn-sm text-white"
              style={{ backgroundColor: "#006400" }}
            >
              {isUpdatingProfile ? "Updating..." : "Update"}
            </button>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop"></form>
      </dialog>
    </>
  );
};
export default EditProfileModal;
