import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { useState } from "react";
import { createHabit } from "../../database/database";
import "./create-habit-modal.css";

type CreateHabitModalProps = {
  isOpen: boolean;
  onClose: () => void;
  updateHabits: () => void;
};

export default function CreateHabitModal({
  isOpen,
  onClose,
  updateHabits,
}: CreateHabitModalProps) {
  const [habitName, setHabitName] = useState("");

  async function onCreateHabit() {
    try {
      await createHabit(habitName, "");
      updateHabits();
    } catch (e) {
      alert("Failed to save the file!");
    }

    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create a habit</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Input
            placeholder="Habit name"
            value={habitName}
            onChange={(e) => setHabitName(e.target.value)}
          ></Input>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={() => onCreateHabit()}>
            Create Habit
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
