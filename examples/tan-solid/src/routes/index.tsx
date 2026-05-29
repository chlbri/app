import { createFileRoute } from '@tanstack/solid-router';
import AccordionQA from '~ui/molecules/AccordionQA';

export const Route = createFileRoute('/')({
  component: () => {
    return (
      <div class='w-full flex flex-col space-y-3 mt-5'>
        <h2 class='text-lg font-semibold'>About Me</h2>
        <div class='flex w-full text-left'>
          <AccordionQA
            data={[
              {
                question: 'Do you want my full name ?',
                answer: 'Yeah ! My name is Charles-Lévi BRI.',
              },
              {
                question: "What's about my bio ?",
                answer:
                  'I am a software engineer and I like pineapple on pizza.',
              },
            ]}
          />
        </div>
      </div>
    );
  },
});
