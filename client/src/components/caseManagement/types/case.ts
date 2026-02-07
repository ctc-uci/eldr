export type Case = {
  title: string;
  assignee: string;
  description: string;
  tags: {
    language: string;
    area: string;
  };
};
