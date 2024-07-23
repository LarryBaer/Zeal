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

type DeleteHabitModalProps = {
  isOpen: boolean;
  onClose: () => void;
  updateHabits: () => void;
  habit: any;
};

export default function DeleteHabitModal({
  isOpen,
  onClose,
  updateHabits,
  habit,
}: DeleteHabitModalProps) {
  async function onDelete() {
    try {
      await deleteHabit(habit.habit_id);
      updateHabits();
    } catch (e) {
      alert("Deleting habit failed, please try again.");
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
          <div>{`Are you sure you would like to delete "${habit.name}"? This action cannot be undone.`}</div>
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
