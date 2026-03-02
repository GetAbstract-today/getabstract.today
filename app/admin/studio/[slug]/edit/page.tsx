"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { NoiseOverlay } from "@/components/landing-website";
import TopicForm, { type TopicFormData } from "@/components/topic-form";

export default function EditTopicPage() {
  const { slug } = useParams<{ slug: string }>();
  const [data, setData] = useState<TopicFormData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/topics/${slug}`);
        if (!res.ok) {
          setError("Topic not found");
          return;
        }
        const topic = await res.json();
        setData({
          slug: topic.slug,
          name: topic.name,
          icon: topic.icon,
          description: topic.description,
          tagline: topic.tagline,
          role: topic.role,
          topicScope: topic.topicScope,
          titlePrefix: topic.titlePrefix,
          toneNotes: topic.toneNotes || "",
          prioritySources:
            topic.prioritySources?.length > 0 ? topic.prioritySources : [""],
          exampleSubjects:
            topic.exampleSubjects?.length > 0 ? topic.exampleSubjects : [""],
        });
      } catch {
        setError("Failed to load topic");
      }
    };
    load();
  }, [slug]);

  if (error) {
    return (
      <div className="landing-page selection:bg-[#FF3300] selection:text-white min-h-screen flex flex-col">
        <NoiseOverlay />
        <main className="flex-1 w-full border-b-2 border-black bg-[#E6E6E6] p-6 lg:p-12 flex items-center justify-center">
          <div className="bg-white border-2 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center">
            <p className="font-tech text-sm text-red-600 uppercase">{error}</p>
          </div>
        </main>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="landing-page selection:bg-[#FF3300] selection:text-white min-h-screen flex flex-col">
        <NoiseOverlay />
        <main className="flex-1 w-full border-b-2 border-black bg-[#E6E6E6] p-6 lg:p-12 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
        </main>
      </div>
    );
  }

  return <TopicForm mode="edit" initialData={data} />;
}
