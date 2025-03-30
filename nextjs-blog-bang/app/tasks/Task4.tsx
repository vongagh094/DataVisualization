import TaskCard from "../components/TaskCard"

export default function Task4() {
  return (
    <TaskCard taskNumber={1} title="Task 1" description="This task will be implemented in the future.">
      <div className="flex items-center justify-center h-[200px] text-muted-foreground">
        <p>No content available yet</p>
      </div>
    </TaskCard>
  )
}

