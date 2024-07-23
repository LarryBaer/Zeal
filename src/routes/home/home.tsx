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
import getColorMap from "../../utils/color-util";
import "./home.css";

export default function Home() {
  const [isStopwatchEnabled, setIsStopwatchEnabled] = useState(false);
  const [isStopwatchRunning, setIsStopwatchRunning] = useState(false);
  const [habitToEdit, setHabitToEdit] = useState<any>({});
  const [time, setTime] = useState(0);
  const [habits, setHabits] = useState<any[]>([]);
  const [heatmapData, setHeatmapData] = useState<any[]>([]);
  const [searchValue, setSearchValue] = useState("");

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

  function startAndStopTimer() {
    setIsStopwatchRunning(!isStopwatchRunning);
  }

  function resetStopwatch() {
    setTime(0);
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
          const habitHeatmapData = heatmapData.filter(
            (obj) => obj.habit_id === habit.habit_id
          );
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
                    setHabitToEdit(habit);
                    onDeleteOpen();
                  }}
                >
                  <CloseIcon />
                </div>
              </div>
              <div className="heatmap">
                <HeatMap
                  value={habitHeatmapData}
                  weekLabels={["", "Mon", "", "Wed", "", "Fri", ""]}
                  startDate={new Date("2024/01/01")}
                  endDate={new Date("2024/12/30")}
                  width={960}
                  height={160}
                  rectSize={15}
                  space={2.5}
                  panelColors={getColorMap(habit.color, habitHeatmapData)}
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
                        {Math.floor(time / 3600)}:
                        {Math.floor((time % 3600) / 60)
                          .toString()
                          .padStart(2, "0")}
                        :
                        {Math.floor(time % 60)
                          .toString()
                          .padStart(2, "0")}
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
                    setHabitToEdit(habit);
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
        habit={habitToEdit}
      />
      <LogTodayModal
        isOpen={isLogOpen}
        onClose={onLogClose}
        updateHabits={getHabitHeatmapData}
        habitId={habitToEdit.habit_id}
        timerCount={time}
      />
    </div>
  );
}
