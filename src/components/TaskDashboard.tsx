import { useState } from "react";
import { Plus, Calendar, Target, Zap, BarChart3, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import DotGrid from "./DotGrid";

interface Task {
  id: string;
  title: string;
  priority: "high" | "medium" | "low";
  category: string;
  completed: boolean;
  dueDate?: string;
}

const TaskDashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Complete project proposal",
      priority: "high",
      category: "Work",
      completed: false,
      dueDate: "2024-01-15"
    },
    {
      id: "2", 
      title: "Plan weekend trip",
      priority: "medium",
      category: "Personal",
      completed: false,
      dueDate: "2024-01-20"
    },
    {
      id: "3",
      title: "Read 20 pages of book",
      priority: "low",
      category: "Learning",
      completed: true
    }
  ]);

  const [newTask, setNewTask] = useState("");

  const addTask = () => {
    if (newTask.trim()) {
      const task: Task = {
        id: Date.now().toString(),
        title: newTask,
        priority: "medium",
        category: "General",
        completed: false
      };
      setTasks([task, ...tasks]);
      setNewTask("");
    }
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const completedTasks = tasks.filter(task => task.completed).length;
  const completionRate = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "destructive";
      case "medium": return "warning";
      case "low": return "success";
      default: return "secondary";
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-hero p-6 overflow-hidden">
      {/* Dot Grid Background */}
      <DotGrid 
        dotSize={3}
        gap={25}
        baseColor="rgba(255, 255, 255, 0.2)"
        activeColor="rgba(255, 255, 255, 0.8)"
        proximity={80}
        shockRadius={120}
        shockStrength={6}
      />
      
      <div className="relative z-20 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Smart Task Organizer</h1>
            <p className="text-white/80 text-lg">Boost your productivity with AI-powered insights</p>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" size="lg" className="shadow-elegant">
              <Settings className="w-5 h-5 mr-2" />
              Settings
            </Button>
            <Button size="lg" className="bg-white/20 hover:bg-white/30 text-white border-white/20 backdrop-blur-sm shadow-glow">
              <BarChart3 className="w-5 h-5 mr-2" />
              Analytics
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-card border-0 shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Total Tasks</p>
                  <p className="text-3xl font-bold">{tasks.length}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-0 shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Completed</p>
                  <p className="text-3xl font-bold text-success">{completedTasks}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-success rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-0 shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Completion Rate</p>
                  <p className="text-3xl font-bold">{Math.round(completionRate)}%</p>
                </div>
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-0 shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">This Week</p>
                  <p className="text-3xl font-bold">12</p>
                </div>
                <div className="w-12 h-12 bg-gradient-soft rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Task Input */}
          <div className="lg:col-span-2">
            <Card className="bg-gradient-card border-0 shadow-elegant">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5 text-primary" />
                  Add New Task
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <Input
                    placeholder="What needs to be done?"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addTask()}
                    className="flex-1 border-0 bg-white/50 shadow-soft"
                  />
                  <Button 
                    onClick={addTask}
                    className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground">
                  💡 <strong>AI Tip:</strong> Try being specific about deadlines and priorities for better task management!
                </div>
              </CardContent>
            </Card>

            {/* Task List */}
            <Card className="bg-gradient-card border-0 shadow-elegant mt-6">
              <CardHeader>
                <CardTitle>Today's Tasks</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`p-4 rounded-lg border transition-all duration-300 hover:shadow-soft cursor-pointer ${
                      task.completed 
                        ? "bg-success-soft border-success/20 opacity-75" 
                        : "bg-white/80 border-border hover:border-primary/30"
                    }`}
                    onClick={() => toggleTask(task.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                          task.completed 
                            ? "bg-success border-success" 
                            : "border-muted-foreground hover:border-primary"
                        }`} />
                        <span className={`font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                          {task.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={getPriorityColor(task.priority) as any} className="capitalize">
                          {task.priority}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {task.category}
                        </Badge>
                      </div>
                    </div>
                    {task.dueDate && (
                      <div className="mt-2 text-sm text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                ))}
                
                {tasks.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">No tasks yet!</p>
                    <p>Add your first task to get started with your productivity journey.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* AI Insights Panel */}
          <div className="space-y-6">
            <Card className="bg-gradient-card border-0 shadow-elegant">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-warning" />
                  AI Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-primary-soft rounded-lg">
                  <p className="text-sm font-medium text-primary">🎯 Focus Recommendation</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Tackle high-priority tasks first. You're most productive between 9-11 AM!
                  </p>
                </div>
                <div className="p-3 bg-success-soft rounded-lg">
                  <p className="text-sm font-medium text-success">📈 Progress Update</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Great job! You've completed {completedTasks} tasks today. Keep the momentum going!
                  </p>
                </div>
                <div className="p-3 bg-warning-soft rounded-lg">
                  <p className="text-sm font-medium text-warning">⏰ Time Management</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Consider breaking down larger tasks into smaller, manageable chunks.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-0 shadow-elegant">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start border-primary/20 hover:bg-primary-soft">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Daily Review
                </Button>
                <Button variant="outline" className="w-full justify-start border-success/20 hover:bg-success-soft">
                  <Target className="w-4 h-4 mr-2" />
                  Set Weekly Goals
                </Button>
                <Button variant="outline" className="w-full justify-start border-warning/20 hover:bg-warning-soft">
                  <Zap className="w-4 h-4 mr-2" />
                  Get AI Suggestions
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDashboard;