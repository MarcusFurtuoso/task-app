export interface Task {
  id: string;
  title: string;
  description: string;
  items: item[];
}

export interface item {
  name: string;
  completed: boolean;
}
