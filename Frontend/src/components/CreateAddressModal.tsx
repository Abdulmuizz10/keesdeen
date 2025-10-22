import React from "react";

interface SetShowModalProp {
  setShowModal: (value: boolean) => void;
}

const CreateAddressModal: React.FC<SetShowModalProp> = ({ setShowModal }) => {
  return (
    <div
      className="fixed inset-0 h-screen w-screen flex items-center justify-center bg-black/50 z-50"
      onClick={() => setShowModal(false)}
    >
      hello how are you doing
    </div>
  );
};

export default CreateAddressModal;
