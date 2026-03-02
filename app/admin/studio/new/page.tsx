import TopicForm from "@/components/topic-form";

export const metadata = {
  title: "New Topic | Newsletter Studio",
};

export default function NewTopicPage() {
  return <TopicForm mode="create" />;
}
