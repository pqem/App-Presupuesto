"use client";

import { useUi } from "@/context/UiContext";
import Modal from "./Modal";
import TransactionForm from "./TransactionForm";

export default function GlobalModals() {
    const { isTransactionModalOpen, closeTransactionModal } = useUi();

    return (
        <>
            <Modal
                isOpen={isTransactionModalOpen}
                onClose={closeTransactionModal}
                title="Nueva Transacción"
            >
                <TransactionForm onClose={closeTransactionModal} />
            </Modal>
        </>
    );
}
