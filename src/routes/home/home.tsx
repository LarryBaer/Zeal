import HeatMap from "@uiw/react-heat-map";
import {
  Button,
  Heading,
  Input,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import CreateHabitModal from "../../components/create-habit-modal/create-habit-modal";
import DeleteHabitModal from "../../components/delete-habit-modal/delete-habit-modal";
import LogTodayModal from "../../components/log-today-modal/log-today-modal";
import { useEffect, useState } from "react";
import { getHabits, getHeatmapData } from "../../database/database";
import "./home.css";

export default function Home() {
  const [isStopwatchEnabled, setIsStopwatchEnabled] = useState(false);
  const [isStopwatchRunning, setIsStopwatchRunning] = useState(false);
  const [habitToEditId, setHabitToEditId] = useState();
  const [habitToDeleteName, setHabitToDeleteName] = useState("");
  const [time, setTime] = useState(0);
  const [habits, setHabits] = useState<any[]>([]);
  const [heatmapData, setHeatmapData] = useState<any[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = Math.floor(time % 60);

  const {
    isOpen: isCreateOpen,
    onOpen: onCreateOpen,
    onClose: onCreateClose,
  } = useDisclosure();

  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  const {
    isOpen: isLogOpen,
    onOpen: onLogOpen,
    onClose: onLogClose,
  } = useDisclosure();

  async function getHabitData() {
    const habitData = await getHabits();
    setHabits(habitData as any[]);
  }

  async function getHabitHeatmapData() {
    const newHeatmapData = await getHeatmapData();
    setHeatmapData(newHeatmapData as any[]);
  }

  function getPanelColors(habitHeatmapValues: any[]) {
    let numbers = habitHeatmapValues.map((a: any) => a.count);
    const min = Math.min(...numbers);
    const max = Math.max(...numbers);

    const one = Math.floor(min + (max - min) * 0.1);
    const two = Math.floor(min + (max - min) * 0.25);
    const three = Math.floor(min + (max - min) * 0.4);
    const four = Math.floor(min + (max - min) * 0.65);
    const five = Math.floor(min + (max - min) * 0.75);
    const six = Math.floor(min + (max - min) * 0.9);

    const thresholds: Record<number, string> = {
      [one]: "#ecfdf5",
      [two]: "#d1fae5",
      [three]: "#99f6e4",
      [four]: "#5eead4",
      [five]: "#2dd4bf",
      [six]: "#14b8a6",
    };

    return thresholds;
  }

  useEffect(() => {
    getHabitData();
    getHabitHeatmapData();
  }, []);

  useEffect(() => {
    let intervalId: any;
    if (isStopwatchRunning) {
      intervalId = setInterval(() => setTime(time + 1), 1000);
    }
    return () => clearInterval(intervalId);
  }, [isStopwatchRunning, time]);

  const startAndStopTimer = () => {
    setIsStopwatchRunning(!isStopwatchRunning);
  };

  const resetStopwatch = () => {
    setTime(0);
  };

  return (
    <div className="home">
      <div className="header-container">
        <Input
          placeholder="Search..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="habit-search"
        ></Input>
        <Button
          className="new-habit-button"
          onClick={onCreateOpen}
          variant="outline"
        >
          New Habit
        </Button>
      </div>
      <div className="habit-container">
        {habits.map((habit, index) => {
          if (searchValue !== "" && !habit.name.includes(searchValue)) return;
          return (
            <div className="habit" key={"habit" + index}>
              <div className="habit-header">
                <div className="left-header">
                  <Heading size="lg" className="habit-name">
                    {habit.name}
                  </Heading>
                </div>
                <div
                  className="close-icon"
                  onClick={() => {
                    setHabitToEditId(habit.habit_id);
                    setHabitToDeleteName(habit.name);
                    onDeleteOpen();
                  }}
                >
                  <CloseIcon />
                </div>
              </div>
              <div className="heatmap">
                <HeatMap
                  value={heatmapData.filter(
                    (obj) => obj.habit_id === habit.habit_id
                  )}
                  weekLabels={["", "Mon", "", "Wed", "", "Fri", ""]}
                  startDate={new Date("2024/01/01")}
                  endDate={new Date("2024/12/30")}
                  width={960}
                  height={160}
                  rectSize={15}
                  space={2.5}
                  panelColors={getPanelColors(
                    heatmapData.filter((obj) => obj.habit_id === habit.habit_id)
                  )}
                  rectRender={(props, data) => {
                    return (
                      <Tooltip label={data.date} placement="right">
                        <rect {...props} rx={2} />
                      </Tooltip>
                    );
                  }}
                />
              </div>
              <div className="habit-footer">
                <div className="stopwatch-container">
                  {isStopwatchEnabled ? (
                    <div className="stopwatch">
                      <Button
                        onClick={() => startAndStopTimer()}
                        className="start-timer-button"
                        variant="outline"
                      >
                        {isStopwatchRunning ? "Stop" : "Start"}
                      </Button>
                      <Button
                        className="reset-timer-button"
                        onClick={() => resetStopwatch()}
                        variant="outline"
                      >
                        Reset
                      </Button>
                      <div className="timer-box">
                        {hours}:{minutes.toString().padStart(2, "0")}:
                        {seconds.toString().padStart(2, "0")}
                      </div>
                    </div>
                  ) : (
                    <Tooltip label="Time your habit and use the value in your log">
                      <Button
                        variant="outline"
                        onClick={() => setIsStopwatchEnabled(true)}
                      >
                        Use stopwatch
                      </Button>
                    </Tooltip>
                  )}
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setHabitToEditId(habit.habit_id);
                    onLogOpen();
                  }}
                >
                  Log today
                </Button>
              </div>
            </div>
          );
        })}
      </div>
      <CreateHabitModal
        isOpen={isCreateOpen}
        onClose={onCreateClose}
        updateHabits={getHabitData}
      />
      <DeleteHabitModal
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        updateHabits={getHabitData}
        habitName={habitToDeleteName}
        habitId={habitToEditId}
      />
      <LogTodayModal
        isOpen={isLogOpen}
        onClose={onLogClose}
        updateHabits={getHabitHeatmapData}
        habitId={habitToEditId}
        timerCount={time}
      />
    </div>
  );
}
