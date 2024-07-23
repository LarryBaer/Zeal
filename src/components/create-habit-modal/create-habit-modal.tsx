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
import { useEffect, useState } from "react";
import { createHabit } from "../../database/database";
import "./create-habit-modal.css";
import { CirclePicker } from "react-color";
import ColorPicker from "../color-picker/color-picker";

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
  const [color, setColor] = useState("blue");

  async function onCreateHabit() {
    try {
      await createHabit(habitName, color);
      updateHabits();
      setHabitName("");
      setColor("blue");
    } catch (e) {
      alert("Creating habit failed, please try again.");
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
          <div style={{ marginTop: 20 }}>
            <b>Choose a color</b>
            <ColorPicker color={color} setColor={setColor} />
          </div>
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
