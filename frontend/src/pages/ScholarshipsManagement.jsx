import React, { useState, useEffect } from "react";
import axiosInstance from "../axiosInstance";

import ScholarshipTable from "../components/ScholarshipAdmin/ScholarshipTable";
import ActionButton from "../components/button/ActionButton";
import SocialButton from "../components/button/SocialButton";
import ScholarshipForm from "../components/ScholarshipAdmin/ScholarshipForm";
import Modal from "../components/Modal";

const ScholarshipsManagement = () => {
  const [scholarships, setScholarships] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteModel, setDeleteModel] = useState(false);

  const [updateSch, setUpdateSch] = useState(null);

  const [selectedId, setSelectedId] = useState([]);

  const API_URL = "/admin/scholarship";

  const handleCloseModal = () => setIsModalOpen(false);

  /* handle toggle active */
  const handleStatus = (id, newStatus) => {
    setScholarships((currentState) =>
      currentState.map((s) =>
        s.scholarship_id === id ? { ...s, is_active: newStatus } : s
      )
    );
  };

  /* get */
  useEffect(() => {
    fetchScholarships();
  }, []);

  const fetchScholarships = async () => {
    try {
      const res = await axiosInstance.get(API_URL);
      setScholarships(res.data);
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  /* add */
  const handleAddClick = () => setIsModalOpen(true);

  const handleAdd = async (formData) => {
    try {
      console.log("Sending FormData:", [...formData.entries()]);

      await axiosInstance.post("/admin/scholarship", formData); 
      
      fetchScholarships();
      setIsModalOpen(false);
    } catch (err) {
      console.log(err);
    }
  };

  /* update */
  const handleUpdateClick = (scholarship) => {
    setUpdateSch(scholarship);
    setIsModalOpen(true);
  };

  const handleUpdate = async (formData) => {
    const id = updateSch?.scholarship_id;
    if (!id) return;

    try {
      console.log("Updating FormData:", [...formData.entries()]);

      await axiosInstance.patch(`/admin/scholarship/${id}`, formData);

      fetchScholarships();
      setIsModalOpen(false);
      setUpdateSch(null);
    } catch (err) {
      console.log(err);
    }
  };

  /* delete */
  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`${API_URL}`, { data: { ids: selectedId } });
      setDeleteModel(false);
      setSelectedId([]);
      fetchScholarships();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className='bg-gray-50 min-h-screen flex flex-col'>
      <h2 className="text-lg font-semibold text-center text-gray-900 p-8">
        จัดการทุนการศึกษา
      </h2>

      {/* modal add + edit */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <ScholarshipForm
          onSubmit={(formData) => {
            if (updateSch) {
              handleUpdate(formData);
            } else {
              handleAdd(formData);
            }
          }}
          onCancel={handleCloseModal}
          data={updateSch}
        />
      </Modal>

      <div className="flex justify-center w-full max-w-full h-auto">
        <div className="w-[90%] mx-auto">
          <div className="justify-end flex gap-2 mb-1 items-center">
            <ActionButton
            action="delete"
            onClick={() => {
              if (selectedId.length === 0) {
                alert("กรุณาเลือกทุนที่ต้องการลบ");
                return;
              }
              setDeleteModel(true);
            }}
          >
            ลบ
          </ActionButton>
          <ActionButton action="add" onClick={handleAddClick}>
            เพิ่ม
          </ActionButton>
          </div>
          <ScholarshipTable
          scholarships={scholarships}
          onEditClick={handleUpdateClick}
          onStatusChange={handleStatus}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
        />
        </div>
      </div>

      {/* confirm delete */}
      <Modal isOpen={deleteModel} onClose={() => setDeleteModel(false)}>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          ยืนยันการลบข้อมูล
        </h3>
        <p className="text-gray-600 mb-6">
          ต้องการลบทุน {selectedId.length} ทุนหรือไม่?
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setDeleteModel(false)}
            className="px-4 py-2 bg-gray-300 text-gray-600 rounded hover:bg-gray-200"
          >
            ยกเลิก
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            ลบ
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default ScholarshipsManagement;