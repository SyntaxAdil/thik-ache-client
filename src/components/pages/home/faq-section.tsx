"use client";

import React from "react";
import { motion, Variants } from "motion/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionHeading } from "@/components/ui/section-heading";

const FAQ_ITEMS = [
  {
    id: "faq-1",
    question: "What exactly is ThikAche?",
    answer: "ThikAche is a hyperlocal community platform designed to connect neighbors in Dhaka for everyday assistance—whether it's running urgent errands, resolving tech issues, or finding trusted local help right next door.",
  },
  {
    id: "faq-2",
    question: "How do I earn money as a helper?",
    answer: "You can browse active requests posted by people living in your residential area. Once you successfully complete a task—like helping an elderly neighbor or handling a delivery—compensation is settled directly based on the request terms.",
  },
  {
    id: "faq-3",
    question: "Is the platform safe to use within my neighborhood?",
    answer: "Safety is our priority. We utilize localized profile verification infrastructure and community feedback loops to ensure all interactions remain transparent, accountable, and secure for everyone involved.",
  },
  {
    id: "faq-4",
    question: "Which areas in Dhaka are currently active?",
    answer: "We are actively expanding across major hubs including Dhanmondi, Lalmatia, Mirpur, and Banani, with more residential zones launching sequentially.",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.1,
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function FAQSection() {
  return (
    <section className="py-24 w-full bg-black tracking-tight select-none border-t border-zinc-900/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col items-center text-center ">
          <SectionHeading
            title="Frequently Asked Questions"
            subtitle="Got questions about how the platform works? Find clear answers right here."
            align="center"
            className="max-w-2xl text-zinc-400 font-normal"
          />
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="w-full "
        >
          
          <Accordion className="w-full space-y-4">
            {FAQ_ITEMS.map((item) => (
              <motion.div key={item.id} variants={itemVariants}>
                <AccordionItem 
                  value={item.id}
                  className="border border-zinc-900 bg-zinc-950/40 hover:bg-zinc-950 px-6 rounded-xl transition-all duration-200"
                >
                  <AccordionTrigger className="text-sm font-semibold text-zinc-200 hover:text-white hover:no-underline py-4 w-full">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-zinc-400 text-sm leading-relaxed pb-4">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>

      </div>
    </section>
  );
}