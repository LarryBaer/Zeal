import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { deleteHabit } from "../../database/database";

type CreateHabitModalProps = {
  isOpen: boolean;
  onClose: () => void;
  updateHabits: () => void;
  habitName: string;
  habitId: number;
};

export default function DeleteHabitModal({
  isOpen,
  onClose,
  updateHabits,
  habitName,
  habitId,
}: CreateHabitModalProps) {
  async function onDelete() {
    try {
      await deleteHabit(habitId);
      updateHabits();
    } catch (e) {
      alert("Failed to save the file !");
    }

    onClose();
  }

  return (
    <Modal size="xl" isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Delete habit</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <div>{`Are you sure you would like to delete "${habitName}"? This action cannot be undone.`}</div>
        </ModalBody>
        <ModalFooter>
          <Button style={{ marginRight: 10 }} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="red" onClick={() => onDelete()}>
            Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
