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
import { logHabit } from "../../database/database";

type CreateHabitModalProps = {
  isOpen: boolean;
  onClose: () => void;
  updateHabits: () => void;
  habitId: number;
  timerCount: number;
};

export default function LogTodayModal({
  isOpen,
  onClose,
  updateHabits,
  habitId,
  timerCount,
}: CreateHabitModalProps) {
  const [timeTracked, setTimeTracked] = useState("");
  async function logToday() {
    try {
      await logHabit(habitId, Number(timeTracked));
      updateHabits();
    } catch (e) {
      alert("Failed to save the file !");
    }

    onClose();
  }

  useEffect(() => {
    setTimeTracked(timerCount.toString());
  }, [timerCount]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Log today</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Input
            placeholder="Time tracked"
            value={timeTracked}
            onChange={(e) => setTimeTracked(e.target.value)}
          ></Input>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="green" onClick={() => logToday()}>
            Log
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
