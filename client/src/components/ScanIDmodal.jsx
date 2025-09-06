import React from "react";
import { AiOutlineClose } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { uiActions } from "../store/ui-slice";

const ScanIDModal = ({ onScan }) => {
  const dispatch = useDispatch();

  const closeModal = () => {
    dispatch(uiActions.closeScanIDModal());
  };

  const handleAutoFill = () => {
    onScan(); // thërret funksionin për të mbushur fushat
    closeModal();
  };

  return (
    <section className="modal">
      <div className="modal__content">
        <header className="modal__header">
          <h4>Skanoni ID</h4>
          <button className="modal__close" onClick={closeModal}>
            <AiOutlineClose />
          </button>
        </header>

        <p>Mund të përdorni kamerën ose të ngarkoni një foto të ID-së.</p>

        <button className="btn primary" onClick={handleAutoFill}>
          Plotëso automatikisht
        </button>
        <button className="btn secondary" onClick={closeModal}>
          Mbyll
        </button>
      </div>
    </section>
  );
};

export default ScanIDModal;
