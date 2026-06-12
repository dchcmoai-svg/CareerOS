"use client";

import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { CommandMenu } from "../command/CommandMenu";
import { IntelligencePanel } from "@/components/intelligence/IntelligencePanel";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShellUIProvider, useShellUI } from "@/lib/ShellUIContext";
import { springs } from "@/lib/motion";
import { GlobalIntelligenceLayer } from "@/components/intelligence/GlobalIntelligenceLayer";
import { usePageIntelligence } from "@/hooks/usePageIntelligence";
import { useUserEcosystem } from "@/lib/UserEcosystemContext";
import { useCareerGraph } from "@/lib/career-graph";
import {
  MessageSquare,
  MessageCircle,
  Mail,
  HelpCircle,
  Settings,
  X,
  Check,
  Copy,
  Send,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children: React.ReactNode;
}

// Custom Chrome SVG component
const ChromeIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="4" />
    <line x1="21.17" y1="8" x2="12" y2="8" />
    <line x1="3.95" y1="6.06" x2="8.54" y2="14" />
    <line x1="10.88" y1="21.94" x2="15.46" y2="14" />
  </svg>
);

// --- Types for mock messaging data ---
interface SmsMessage {
  id: string;
  sender: string;
  avatar: string;
  lastText: string;
  time: string;
  unread: boolean;
  chatHistory: { sender: "them" | "me"; text: string; time: string }[];
}

interface WhatsAppChat {
  id: string;
  contact: string;
  lastMsg: string;
  time: string;
  unread: boolean;
  chatHistory: { sender: "them" | "me"; text: string; time: string }[];
}

interface EmailMessage {
  id: string;
  fromName: string;
  fromEmail: string;
  subject: string;
  date: string;
  unread: boolean;
  body: string;
  replies: { sender: "them" | "me"; text: string; date: string }[];
}

interface ScrapedJob {
  id: string;
  company: string;
  role: string;
  location: string;
  salary: string;
  noticePeriod: string;
  fitScore: number;
  source: string;
  imported: boolean;
}

function AppShellInner({ children }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAgentOpen, setAgentOpen } = useShellUI();
  const { profile } = useUserEcosystem();
  const applications = useCareerGraph((s) => s.applications);
  const setApplications = useCareerGraph((s) => s.setApplications);
  usePageIntelligence();

  const candidateName = profile?.name || "Kumar Kushang";

  // Radial FAB Open State
  const [radialOpen, setRadialOpen] = useState(false);

  // Active Connection Modal Overlay State
  const [activeModal, setActiveModal] = useState<"sms" | "whatsapp" | "gmail" | "extension" | "comm" | "help" | null>(null);

  // --- Account details linked status ---
  const [linkedSmsPhone, setLinkedSmsPhone] = useState("");
  const [linkedWhatsAppPhone, setLinkedWhatsAppPhone] = useState("");
  const [linkedGmailAddress, setLinkedGmailAddress] = useState("");
  const [linkedExtensionToken, setLinkedExtensionToken] = useState("");

  // Temp form inputs
  const [inputSmsPhone, setInputSmsPhone] = useState("");
  const [inputWhatsAppPhone, setInputWhatsAppPhone] = useState("");
  const [inputGmailAddress, setInputGmailAddress] = useState("");
  const [inputExtensionToken, setInputExtensionToken] = useState("");

  // --- Messages (SMS) State ---
  const [smsConversations, setSmsConversations] = useState<SmsMessage[]>([
    {
      id: "sms-razorpay",
      sender: "Razorpay HR",
      avatar: "Rp",
      lastText: "Hey Kumar, we reviewed your resume. Are you free for a call tomorrow at 11 AM?",
      time: "10:30 AM",
      unread: true,
      chatHistory: [
        { sender: "them", text: "Hi Kumar, thanks for applying to our SDE Frontend position.", time: "10:15 AM" },
        { sender: "me", text: "Hi! Glad to connect. Yes, I'd love to chat.", time: "10:20 AM" },
        { sender: "them", text: "Hey Kumar, we reviewed your resume. Are you free for a call tomorrow at 11 AM?", time: "10:30 AM" },
      ],
    },
    {
      id: "sms-paytm",
      sender: "Paytm Recruiter",
      avatar: "Py",
      lastText: "Your application for SDE-2 has been selected for the technical assessment.",
      time: "Yesterday",
      unread: false,
      chatHistory: [
        { sender: "them", text: "Your application for SDE-2 has been selected for the technical assessment.", time: "Yesterday, 3:00 PM" },
      ],
    },
    {
      id: "sms-zomato",
      sender: "Zomato SDE Lead",
      avatar: "Zo",
      lastText: "Liked your featured project on WaterBorne. Let's talk referral.",
      time: "2 days ago",
      unread: false,
      chatHistory: [
        { sender: "them", text: "Hi Kumar, liked your featured project on WaterBorne. Let's talk referral.", time: "June 10, 4:10 PM" },
      ],
    },
  ]);
  const [selectedSmsId, setSelectedSmsId] = useState<string | null>(null);
  const [replySmsText, setReplySmsText] = useState("");

  // --- WhatsApp State ---
  const [whatsappConversations, setWhatsappConversations] = useState<WhatsAppChat[]>([
    {
      id: "wa-swiggy",
      contact: "Swiggy Recruiting Team",
      lastMsg: "Hello Kumar, congrats! The panel approved your frontend SDE-2 round. We'd like to schedule the manager fitment interview.",
      time: "12:15 PM",
      unread: true,
      chatHistory: [
        { sender: "them", text: "Hi Kumar, this is Swiggy SDE Hiring. We saw your CareerOS profile.", time: "June 11, 11:00 AM" },
        { sender: "me", text: "Thanks for reaching out! Glad to hear that.", time: "June 11, 11:30 AM" },
        { sender: "them", text: "Hello Kumar, congrats! The panel approved your frontend SDE-2 round. We'd like to schedule the manager fitment interview.", time: "12:15 PM" },
      ],
    },
    {
      id: "wa-cred",
      contact: "Cred Talent Acquisition",
      lastMsg: "We noticed your notice period is 30 days. Can you join earlier for a buy-out?",
      time: "10:05 AM",
      unread: true,
      chatHistory: [
        { sender: "them", text: "We noticed your notice period is 30 days. Can you join earlier for a buy-out?", time: "10:05 AM" },
      ],
    },
    {
      id: "wa-inmobi",
      contact: "InMobi SDE Team",
      lastMsg: "Could you share your GitHub repo link for the Credit Scoring engine?",
      time: "Yesterday",
      unread: false,
      chatHistory: [
        { sender: "them", text: "Hi Kumar, could you share your GitHub repo link for the Credit Scoring engine?", time: "Yesterday, 5:30 PM" },
      ],
    },
  ]);
  const [selectedWaId, setSelectedWaId] = useState<string | null>(null);
  const [replyWaText, setReplyWaText] = useState("");

  // --- Gmail State ---
  const [emailMessages, setEmailMessages] = useState<EmailMessage[]>([
    {
      id: "mail-flipkart",
      fromName: "Flipkart Careers",
      fromEmail: "careers@flipkart.com",
      subject: "Interview Invitation: Technical Round 1",
      date: "11:45 AM",
      unread: true,
      body: "Dear Kumar Kushang,\n\nThank you for your interest in the SDE-2 position at Flipkart. We would like to invite you for your Technical Round 1, focused on Machine Coding & System Design.\n\nBest regards,\nFlipkart Recruitment Team",
      replies: [],
    },
    {
      id: "mail-groww",
      fromName: "Groww HR Team",
      fromEmail: "talent@groww.in",
      subject: "Offer Letter Discussion: SDE role",
      date: "Yesterday",
      unread: false,
      body: "Hi Kumar,\n\nI hope you're doing well. We'd like to schedule a quick call tomorrow to discuss compensation details and components for your offer letter.\n\nBest,\nGroww Talent Team",
      replies: [
        { sender: "me", text: "Hi, sounds great! I'm available anytime after 2 PM tomorrow.", date: "Yesterday, 6:00 PM" },
      ],
    },
    {
      id: "mail-zepto",
      fromName: "Zepto Recruitment",
      fromEmail: "recruit@zepto.in",
      subject: "Application Received - Software Engineer",
      date: "2 days ago",
      unread: false,
      body: "Hi Kumar,\n\nWe have successfully received your application for the Software Engineer position via your CareerOS profile. Our SDE hiring panel is currently evaluating your credentials.\n\nWarm regards,\nZepto Talent",
      replies: [],
    },
  ]);
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [replyEmailText, setReplyEmailText] = useState("");

  // --- Chrome Extension State ---
  const [scrapedJobs, setScrapedJobs] = useState<ScrapedJob[]>([
    {
      id: "scrape-zomato",
      company: "Zomato",
      role: "Frontend Developer",
      location: "Gurugram",
      salary: "14 - 18 LPA",
      noticePeriod: "Immediate",
      fitScore: 92,
      source: "LinkedIn India",
      imported: false,
    },
    {
      id: "scrape-razorpay",
      company: "Razorpay",
      role: "Backend SDE-2",
      location: "Bengaluru",
      salary: "18 - 25 LPA",
      noticePeriod: "30 Days",
      fitScore: 86,
      source: "Instahyre",
      imported: false,
    },
  ]);

  // --- Help & Support State ---
  const [helpSubject, setHelpSubject] = useState("");
  const [helpMessage, setHelpMessage] = useState("");
  const [submittingHelp, setSubmittingHelp] = useState(false);
  const [helpSubmitted, setHelpSubmitted] = useState(false);

  // --- Action Handlers ---
  const handleLinkSms = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputSmsPhone.trim()) return;
    setLinkedSmsPhone(inputSmsPhone);
  };

  const handleLinkWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputWhatsAppPhone.trim()) return;
    setLinkedWhatsAppPhone(inputWhatsAppPhone);
  };

  const handleLinkGmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputGmailAddress.trim()) return;
    setLinkedGmailAddress(inputGmailAddress);
  };

  const handleLinkExtension = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputExtensionToken.trim()) return;
    setLinkedExtensionToken(inputExtensionToken);
  };

  const sendSmsReply = () => {
    if (!replySmsText.trim() || !selectedSmsId) return;
    setSmsConversations((prev) =>
      prev.map((c) => {
        if (c.id === selectedSmsId) {
          return {
            ...c,
            lastText: replySmsText,
            chatHistory: [...c.chatHistory, { sender: "me", text: replySmsText, time: "Just Now" }],
          };
        }
        return c;
      })
    );
    setReplySmsText("");
  };

  const sendWhatsAppReply = () => {
    if (!replyWaText.trim() || !selectedWaId) return;
    setWhatsappConversations((prev) =>
      prev.map((c) => {
        if (c.id === selectedWaId) {
          return {
            ...c,
            lastMsg: replyWaText,
            chatHistory: [...c.chatHistory, { sender: "me", text: replyWaText, time: "Just Now" }],
          };
        }
        return c;
      })
    );
    setReplyWaText("");
  };

  const sendEmailReply = () => {
    if (!replyEmailText.trim() || !selectedEmailId) return;
    setEmailMessages((prev) =>
      prev.map((m) => {
        if (m.id === selectedEmailId) {
          return {
            ...m,
            replies: [...m.replies, { sender: "me", text: replyEmailText, date: "Just Now" }],
          };
        }
        return m;
      })
    );
    setReplyEmailText("");
  };

  const handleImportScrapedJob = (job: ScrapedJob) => {
    const alreadyApplied = applications.some((a) => a.company === job.company && a.role === job.role);
    if (alreadyApplied) {
      alert(`You have already imported / applied to ${job.role} at ${job.company}.`);
      return;
    }

    const newApp = {
      id: `t-scraped-${Date.now()}`,
      company: job.company,
      role: job.role,
      stage: "Applied" as const,
      stageDays: 0,
      lastInteraction: `Scraped from ${job.source} via Chrome Extension`,
      historicalVelocity: "Fast" as const,
      responseProbability: job.fitScore,
      ghostRisk: "Low" as const,
      resumeBranch: "feature/general-sde",
      followUpIn: "Wait for response",
      nextAction: "N/A",
      jobId: job.id,
      matchScore: job.fitScore,
      expectedResponseDate: "5–10 business days",
    };

    setApplications([newApp, ...applications]);
    setScrapedJobs((prev) =>
      prev.map((j) => (j.id === job.id ? { ...j, imported: true } : j))
    );
    alert(`Successfully imported ${job.role} at ${job.company} directly to Tracker!`);
  };

  const handleSubmitHelp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!helpSubject.trim() || !helpMessage.trim()) return;
    setSubmittingHelp(true);
    setTimeout(() => {
      setSubmittingHelp(false);
      setHelpSubmitted(true);
    }, 1200);
  };

  // --- Unread Counts ---
  const smsUnread = linkedSmsPhone ? smsConversations.filter((c) => c.unread).length : 0;
  const waUnread = linkedWhatsAppPhone ? whatsappConversations.filter((c) => c.unread).length : 0;
  const mailUnread = linkedGmailAddress ? emailMessages.filter((m) => m.unread).length : 0;
  const extensionUnread = linkedExtensionToken ? scrapedJobs.filter((j) => !j.imported).length : 0;
  const totalUnreadCount = smsUnread + waUnread + mailUnread + extensionUnread;

  const currentSmsChat = smsConversations.find((c) => c.id === selectedSmsId);
  const currentWaChat = whatsappConversations.find((c) => c.id === selectedWaId);
  const currentEmail = emailMessages.find((m) => m.id === selectedEmailId);

  // Radial Quadrant Layout Items
  // Radiates from bottom-right trigger. Increased spacing and unified inbox grouping.
  const RADIAL_ITEMS = [
    // Spread items in a gentle arc for better visual balance
    // Tight layout: place items very close to the FAB to eliminate the gap
    { id: "comm", label: "Inbox", icon: MessageSquare, color: "text-primary bg-primary/10 border-primary/20 hover:bg-primary/25", x: -64, y: 0, tooltip: "Unified Inbox (SMS · WhatsApp · Gmail · Chrome)", count: totalUnreadCount },
    { id: "help", label: "Help & Support", icon: HelpCircle, color: "text-text-secondary bg-surface-2 border-border-strong hover:bg-surface-3", x: -40, y: -44, tooltip: "Feedback & Support", count: 0 },
    { id: "settings", label: "Settings", icon: Settings, color: "text-text-secondary bg-surface-2 border-border-strong hover:bg-surface-3", x: -8, y: -64, tooltip: "Quick Settings", count: 0 },
  ];

  return (
    <div className="flex h-screen w-full bg-canvas text-text-primary overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10 shadow-[-10px_0_30px_-15px_rgba(0,0,0,0.5)]">
        <Topbar />
        <GlobalIntelligenceLayer />
        <main className="flex-1 overflow-hidden relative flex min-h-0">
          <div className="flex-1 relative overflow-y-auto overflow-x-hidden min-w-0">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -6, filter: "blur(2px)" }}
                transition={springs.panel}
                className="absolute inset-0 overflow-y-auto px-lg max-w-[1400px] 2xl:max-w-[1600px] mx-auto w-full"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="hidden lg:block h-full">
            <IntelligencePanel isOpen={isAgentOpen} onClose={() => setAgentOpen(false)} variant="docked" />
          </div>
          <div className="lg:hidden">
            <IntelligencePanel
              isOpen={isAgentOpen}
              onClose={() => setAgentOpen(false)}
              variant="overlay"
            />
          </div>
        </main>
      </div>

      <CommandMenu />

      {/* Floating Radial Channels Hub Trigger */}
      <div className="fixed right-8 bottom-8 z-50">
        <button
          onClick={() => setRadialOpen(!radialOpen)}
          className={cn(
            "w-14 h-14 rounded-full flex items-center justify-center border shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer relative",
            radialOpen
              ? "bg-surface-3 border-border-strong text-text-primary"
              : "bg-primary text-white border-primary-hover shadow-[0_8px_30px_rgba(59,130,246,0.4)]"
          )}
        >
          {/* Global unread count badge */}
          {!radialOpen && totalUnreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9.5px] font-black w-5.5 h-5.5 rounded-full flex items-center justify-center border-2 border-canvas shadow-md animate-bounce">
              {totalUnreadCount}
            </span>
          )}

          {radialOpen ? (
            <X className="w-6 h-6 animate-rotate" />
          ) : (
            <MessageSquare className="w-6 h-6" />
          )}
        </button>

        {/* Radial child buttons */}
        <AnimatePresence>
          {radialOpen &&
            RADIAL_ITEMS.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, x: 0, y: 0, scale: 0.5 }}
                  animate={{ opacity: 1, x: item.x, y: item.y, scale: 1 }}
                  exit={{ opacity: 0, x: 0, y: 0, scale: 0.5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25, delay: index * 0.03 }}
                  onClick={() => {
                    if (item.id === "settings") {
                      router.push("/settings");
                    } else {
                      setActiveModal(item.id as any);
                    }
                    setRadialOpen(false);
                  }}
                  className={cn(
                    "absolute top-1.5 left-1.5 w-12 h-12 rounded-full flex items-center justify-center border cursor-pointer group transition-transform duration-150 z-40",
                    // stronger shadow and hover lift for more lively feel
                    "shadow-[0_10px_30px_rgba(2,6,23,0.45)] hover:scale-105",
                    item.color
                  )}
                >
                  {/* Tooltip */}
                  <span className="absolute right-16 bg-surface-3 border border-hairline text-text-primary text-[11px] font-semibold px-3 py-1 rounded-lg shadow-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-all transform translate-x-1 whitespace-nowrap z-50">
                    {item.tooltip}
                  </span>

                  {/* Channel specific unread count */}
                  {item.count > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center border border-canvas shadow-sm">
                      {item.count}
                    </span>
                  )}

                  <div className="w-7 h-7 rounded-full flex items-center justify-center bg-white/5 group-hover:bg-white/8">
                    <IconComponent className="w-4.5 h-4.5 shrink-0" />
                  </div>
                </motion.button>
              );
            })}
        </AnimatePresence>
      </div>

      {/* Connection Modals */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-md">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
              className="fixed inset-0 bg-black/75 backdrop-blur-xs cursor-pointer"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="w-full max-w-lg bg-surface-1 border border-hairline rounded-2xl shadow-2xl p-6 cursor-default relative overflow-hidden flex flex-col z-10 h-[480px]"
            >
              {/* Close icon */}
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="absolute right-4 top-4 p-1 hover:bg-surface-2 rounded-lg text-text-tertiary hover:text-text-primary transition-colors cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>

              {/* UNIFIED INBOX MENU (opens individual channel modals) */}
              {activeModal === "comm" && (
                <div className="flex flex-col h-full">
                  <div className="flex items-center gap-2 mb-3">
                    <MessageSquare className="w-5 h-5 text-primary" />
                    <div>
                      <h3 className="text-sm font-bold text-text-primary">Unified Inbox</h3>
                      <p className="text-[10px] text-text-tertiary">SMS · WhatsApp · Gmail · Chrome</p>
                    </div>
                  </div>

                  <div className="h-px bg-hairline mb-3" />

                  <div className="flex-1 flex flex-col justify-center items-stretch space-y-3">
                    <button onClick={() => setActiveModal("sms")} className="w-full flex items-center gap-3 p-3 bg-surface-2 border border-hairline rounded-lg hover:bg-surface-3 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[12px]">SMS</div>
                      <div className="flex-1 text-left">
                        <div className="text-sm font-semibold text-text-primary">Messages</div>
                        <div className="text-[11px] text-text-tertiary">Recruiter SMS inbox</div>
                      </div>
                      {smsUnread > 0 && <span className="text-[12px] font-bold text-white bg-primary px-2 py-0.5 rounded-md">{smsUnread}</span>}
                    </button>

                    <button onClick={() => setActiveModal("whatsapp")} className="w-full flex items-center gap-3 p-3 bg-surface-2 border border-hairline rounded-lg hover:bg-surface-3 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-success/10 text-success flex items-center justify-center font-bold text-[12px]">WA</div>
                      <div className="flex-1 text-left">
                        <div className="text-sm font-semibold text-text-primary">WhatsApp</div>
                        <div className="text-[11px] text-text-tertiary">Recruiter chats</div>
                      </div>
                      {waUnread > 0 && <span className="text-[12px] font-bold text-white bg-success px-2 py-0.5 rounded-md">{waUnread}</span>}
                    </button>

                    <button onClick={() => setActiveModal("gmail")} className="w-full flex items-center gap-3 p-3 bg-surface-2 border border-hairline rounded-lg hover:bg-surface-3 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-danger/10 text-danger flex items-center justify-center font-bold text-[12px]">G</div>
                      <div className="flex-1 text-left">
                        <div className="text-sm font-semibold text-text-primary">Gmail</div>
                        <div className="text-[11px] text-text-tertiary">Recruiter emails</div>
                      </div>
                      {mailUnread > 0 && <span className="text-[12px] font-bold text-white bg-danger px-2 py-0.5 rounded-md">{mailUnread}</span>}
                    </button>

                    <button onClick={() => setActiveModal("extension")} className="w-full flex items-center gap-3 p-3 bg-surface-2 border border-hairline rounded-lg hover:bg-surface-3 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-warning/10 text-warning flex items-center justify-center font-bold text-[12px]">E</div>
                      <div className="flex-1 text-left">
                        <div className="text-sm font-semibold text-text-primary">Chrome Extension</div>
                        <div className="text-[11px] text-text-tertiary">Scraped job stream</div>
                      </div>
                      {extensionUnread > 0 && <span className="text-[12px] font-bold text-white bg-warning px-2 py-0.5 rounded-md">{extensionUnread}</span>}
                    </button>
                  </div>
                </div>
              )}

              {/* SMS MESSAGES MODAL */}
              {activeModal === "sms" && (
                <div className="flex flex-col h-full">
                  <div className="flex items-center gap-2 mb-3">
                    <MessageSquare className="w-5 h-5 text-primary" />
                    <div>
                      <h3 className="text-sm font-bold text-text-primary">SMS Recruiters Inbox</h3>
                      {linkedSmsPhone && <p className="text-[10px] text-text-tertiary">Linked phone: {linkedSmsPhone}</p>}
                    </div>
                  </div>

                  <div className="h-px bg-hairline mb-3" />

                  {!linkedSmsPhone ? (
                    <form onSubmit={handleLinkSms} className="flex-1 flex flex-col justify-center items-center max-w-xs mx-auto text-center space-y-4">
                      <div className="p-3 bg-primary/10 text-primary rounded-full border border-primary/20">
                        <MessageSquare className="w-6 h-6" />
                      </div>
                      <div className="space-y-1.5">
                        <h4 className="text-xs font-bold text-text-primary">Link Your Phone Number</h4>
                        <p className="text-[10.5px] text-text-tertiary leading-normal">Enter your mobile number to load recruiter text messages and interview notices directly in CareerOS.</p>
                      </div>
                      <div className="w-full flex gap-2">
                        <input
                          type="text"
                          required
                          placeholder="e.g. +91 99887 76655"
                          value={inputSmsPhone}
                          onChange={(e) => setInputSmsPhone(e.target.value)}
                          className="flex-1 bg-surface-2 border border-hairline rounded-lg px-3 py-1.5 text-xs text-text-primary focus:outline-hidden"
                        />
                        <button type="submit" className="bg-primary hover:bg-primary/95 text-white font-bold text-xs px-4 py-1.5 rounded-lg cursor-pointer">
                          Link
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex-1 flex flex-col min-h-0">
                      {selectedSmsId ? (
                        <div className="flex-1 flex flex-col min-h-0">
                          <button
                            onClick={() => setSelectedSmsId(null)}
                            className="flex items-center gap-1 text-[10px] text-text-tertiary hover:text-text-primary font-bold mb-3 cursor-pointer self-start"
                          >
                            <ArrowLeft className="w-3.5 h-3.5" /> Back to list
                          </button>
                          
                          <div className="bg-surface-2 border border-hairline/60 px-3 py-2 rounded-lg text-xs font-bold text-text-primary mb-2">
                            {currentSmsChat?.sender}
                          </div>

                          <div className="flex-1 overflow-y-auto space-y-2 p-2 bg-surface-2/40 border border-hairline rounded-lg mb-3 min-h-0 scrollbar-thin">
                            {currentSmsChat?.chatHistory.map((h, i) => (
                              <div key={i} className={cn("flex flex-col max-w-[80%] rounded-xl p-2.5 text-xs leading-normal", h.sender === "me" ? "bg-primary text-white ml-auto" : "bg-surface-3 border border-hairline text-text-secondary")}>
                                <p>{h.text}</p>
                                <span className="text-[8px] opacity-75 mt-1 self-end text-mono-operational">{h.time}</span>
                              </div>
                            ))}
                          </div>

                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Type SMS response..."
                              value={replySmsText}
                              onChange={(e) => setReplySmsText(e.target.value)}
                              onKeyDown={(e) => e.key === "Enter" && sendSmsReply()}
                              className="flex-1 bg-surface-2 border border-hairline rounded-lg px-3 py-1.5 text-xs text-text-primary focus:outline-hidden"
                            />
                            <button onClick={sendSmsReply} className="bg-primary text-white rounded-lg px-4 py-1.5 text-xs font-bold cursor-pointer">
                              Send
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
                          {smsConversations.map((c) => (
                            <div
                              key={c.id}
                              onClick={() => {
                                setSmsConversations((prev) =>
                                  prev.map((sms) => (sms.id === c.id ? { ...sms, unread: false } : sms))
                                );
                                setSelectedSmsId(c.id);
                              }}
                              className="bg-surface-2/60 hover:bg-surface-2 border border-hairline hover:border-border-strong rounded-xl p-3 flex items-center justify-between gap-3 cursor-pointer transition-all"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary border border-primary/20 font-bold text-xs flex items-center justify-center shrink-0">
                                  {c.avatar}
                                </div>
                                <div className="min-w-0">
                                  <h4 className="text-xs font-bold text-text-primary flex items-center gap-1.5">
                                    {c.sender}
                                    {c.unread && <span className="w-1.5 h-1.5 bg-primary rounded-full" />}
                                  </h4>
                                  <p className="text-[10.5px] text-text-tertiary truncate mt-0.5">{c.lastText}</p>
                                </div>
                              </div>
                              <span className="text-[9px] text-text-tertiary text-mono-operational shrink-0">{c.time}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* WHATSAPP INBOX MODAL */}
              {activeModal === "whatsapp" && (
                <div className="flex flex-col h-full">
                  <div className="flex items-center gap-2 mb-3">
                    <MessageCircle className="w-5 h-5 text-success" />
                    <div>
                      <h3 className="text-sm font-bold text-text-primary">WhatsApp Recruiter Inbox</h3>
                      {linkedWhatsAppPhone && <p className="text-[10px] text-text-tertiary">Linked WhatsApp: {linkedWhatsAppPhone}</p>}
                    </div>
                  </div>

                  <div className="h-px bg-hairline mb-3" />

                  {!linkedWhatsAppPhone ? (
                    <form onSubmit={handleLinkWhatsApp} className="flex-1 flex flex-col justify-center items-center max-w-xs mx-auto text-center space-y-4">
                      <div className="p-3 bg-success/10 text-success rounded-full border border-success/20">
                        <MessageCircle className="w-6 h-6" />
                      </div>
                      <div className="space-y-1.5">
                        <h4 className="text-xs font-bold text-text-primary">Link Your WhatsApp</h4>
                        <p className="text-[10.5px] text-text-tertiary leading-normal">Connect your WhatsApp details to manage Indian recruiter chats and follow up with recruiters directly inside CareerOS.</p>
                      </div>
                      <div className="w-full flex gap-2">
                        <input
                          type="text"
                          required
                          placeholder="e.g. +91 98765 43210"
                          value={inputWhatsAppPhone}
                          onChange={(e) => setInputWhatsAppPhone(e.target.value)}
                          className="flex-1 bg-surface-2 border border-hairline rounded-lg px-3 py-1.5 text-xs text-text-primary focus:outline-hidden"
                        />
                        <button type="submit" className="bg-success text-canvas font-bold text-xs px-4 py-1.5 rounded-lg cursor-pointer">
                          Link
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex-1 flex flex-col min-h-0">
                      {selectedWaId ? (
                        <div className="flex-1 flex flex-col min-h-0">
                          <button
                            onClick={() => setSelectedWaId(null)}
                            className="flex items-center gap-1 text-[10px] text-text-tertiary hover:text-text-primary font-bold mb-3 cursor-pointer self-start"
                          >
                            <ArrowLeft className="w-3.5 h-3.5" /> Back to chats
                          </button>
                          
                          <div className="bg-surface-2 border border-hairline/60 px-3 py-2 rounded-lg text-xs font-bold text-text-primary mb-2 flex justify-between items-center">
                            <span>{currentWaChat?.contact}</span>
                            <span className="text-[9px] text-success font-semibold bg-success/5 px-2 py-0.5 rounded-full border border-success/10">Active WhatsApp Bot</span>
                          </div>

                          <div className="flex-1 overflow-y-auto space-y-2 p-2 bg-surface-2/40 border border-hairline rounded-lg mb-3 min-h-0 scrollbar-thin">
                            {currentWaChat?.chatHistory.map((h, i) => (
                              <div key={i} className={cn("flex flex-col max-w-[80%] rounded-xl p-2.5 text-xs leading-normal", h.sender === "me" ? "bg-success/90 text-canvas ml-auto font-medium" : "bg-surface-3 border border-hairline text-text-secondary")}>
                                <p>{h.text}</p>
                                <span className="text-[8px] opacity-75 mt-1 self-end text-mono-operational">{h.time}</span>
                              </div>
                            ))}
                          </div>

                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Type WhatsApp message..."
                              value={replyWaText}
                              onChange={(e) => setReplyWaText(e.target.value)}
                              onKeyDown={(e) => e.key === "Enter" && sendWhatsAppReply()}
                              className="flex-1 bg-surface-2 border border-hairline rounded-lg px-3 py-1.5 text-xs text-text-primary focus:outline-hidden"
                            />
                            <button onClick={sendWhatsAppReply} className="bg-success text-canvas rounded-lg px-4 py-1.5 text-xs font-bold cursor-pointer">
                              Send
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
                          {whatsappConversations.map((c) => (
                            <div
                              key={c.id}
                              onClick={() => {
                                setWhatsappConversations((prev) =>
                                  prev.map((wa) => (wa.id === c.id ? { ...wa, unread: false } : wa))
                                );
                                setSelectedWaId(c.id);
                              }}
                              className="bg-surface-2/60 hover:bg-surface-2 border border-hairline hover:border-border-strong rounded-xl p-3 flex items-center justify-between gap-3 cursor-pointer transition-all"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="w-8 h-8 rounded-full bg-success/15 text-success font-black text-xs flex items-center justify-center shrink-0 border border-success/20">
                                  WA
                                </div>
                                <div className="min-w-0">
                                  <h4 className="text-xs font-bold text-text-primary flex items-center gap-1.5">
                                    {c.contact}
                                    {c.unread && <span className="w-1.5 h-1.5 bg-success rounded-full" />}
                                  </h4>
                                  <p className="text-[10.5px] text-text-tertiary truncate mt-0.5">{c.lastMsg}</p>
                                </div>
                              </div>
                              <span className="text-[9px] text-text-tertiary text-mono-operational shrink-0">{c.time}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* GMAIL INBOX MODAL */}
              {activeModal === "gmail" && (
                <div className="flex flex-col h-full">
                  <div className="flex items-center gap-2 mb-3">
                    <Mail className="w-5 h-5 text-danger" />
                    <div>
                      <h3 className="text-sm font-bold text-text-primary">Gmail Recruiter Inbox</h3>
                      {linkedGmailAddress && <p className="text-[10px] text-text-tertiary">Connected: {linkedGmailAddress}</p>}
                    </div>
                  </div>

                  <div className="h-px bg-hairline mb-3" />

                  {!linkedGmailAddress ? (
                    <form onSubmit={handleLinkGmail} className="flex-1 flex flex-col justify-center items-center max-w-xs mx-auto text-center space-y-4">
                      <div className="p-3 bg-danger/10 text-danger rounded-full border border-danger/20">
                        <Mail className="w-6 h-6" />
                      </div>
                      <div className="space-y-1.5">
                        <h4 className="text-xs font-bold text-text-primary">Link Gmail Account</h4>
                        <p className="text-[10.5px] text-text-tertiary leading-normal">Link your SDE recruitment email address to aggregate recruiter invitations, assessments, and offers.</p>
                      </div>
                      <div className="w-full flex gap-2">
                        <input
                          type="email"
                          required
                          placeholder="e.g. kushang@gmail.com"
                          value={inputGmailAddress}
                          onChange={(e) => setInputGmailAddress(e.target.value)}
                          className="flex-1 bg-surface-2 border border-hairline rounded-lg px-3 py-1.5 text-xs text-text-primary focus:outline-hidden"
                        />
                        <button type="submit" className="bg-danger text-white font-bold text-xs px-4 py-1.5 rounded-lg cursor-pointer">
                          Link
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex-1 flex flex-col min-h-0">
                      {selectedEmailId ? (
                        <div className="flex-1 flex flex-col min-h-0">
                          <button
                            onClick={() => setSelectedEmailId(null)}
                            className="flex items-center gap-1 text-[10px] text-text-tertiary hover:text-text-primary font-bold mb-3 cursor-pointer self-start"
                          >
                            <ArrowLeft className="w-3.5 h-3.5" /> Back to emails
                          </button>

                          <div className="bg-surface-2 border border-hairline/60 p-3 rounded-lg text-xs space-y-2 mb-3">
                            <h4 className="font-bold text-text-primary text-sm">{currentEmail?.subject}</h4>
                            <div className="flex justify-between text-[10.5px] text-text-secondary border-t border-hairline/40 pt-1.5">
                              <span>From: <b>{currentEmail?.fromName}</b> ({currentEmail?.fromEmail})</span>
                              <span className="text-mono-operational text-text-tertiary">{currentEmail?.date}</span>
                            </div>
                          </div>

                          <div className="flex-1 overflow-y-auto p-3 bg-surface-2/40 border border-hairline rounded-lg text-xs text-text-secondary leading-relaxed mb-3 whitespace-pre-line scrollbar-thin min-h-0">
                            <p>{currentEmail?.body}</p>
                            
                            {currentEmail?.replies.map((r, i) => (
                              <div key={i} className="border-t border-hairline/50 mt-3 pt-3 space-y-1 bg-surface-1/30 p-2.5 rounded-lg">
                                <div className="flex justify-between text-[9px] font-bold text-text-tertiary">
                                  <span>{r.sender === "me" ? "Drafted Response" : "Recruiter"}</span>
                                  <span className="text-mono-operational">{r.date}</span>
                                </div>
                                <p className="text-text-primary">{r.text}</p>
                              </div>
                            ))}
                          </div>

                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Draft email response..."
                              value={replyEmailText}
                              onChange={(e) => setReplyEmailText(e.target.value)}
                              onKeyDown={(e) => e.key === "Enter" && sendEmailReply()}
                              className="flex-1 bg-surface-2 border border-hairline rounded-lg px-3 py-1.5 text-xs text-text-primary focus:outline-hidden"
                            />
                            <button onClick={sendEmailReply} className="bg-danger text-white rounded-lg px-4 py-1.5 text-xs font-bold cursor-pointer">
                              Reply
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
                          {emailMessages.map((m) => (
                            <div
                              key={m.id}
                              onClick={() => {
                                setEmailMessages((prev) =>
                                  prev.map((mail) => (mail.id === m.id ? { ...mail, unread: false } : mail))
                                );
                                setSelectedEmailId(m.id);
                              }}
                              className="bg-surface-2/60 hover:bg-surface-2 border border-hairline hover:border-border-strong rounded-xl p-3 flex flex-col gap-1 cursor-pointer transition-all"
                            >
                              <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-text-primary flex items-center gap-1.5">
                                  {m.fromName}
                                  {m.unread && <span className="w-1.5 h-1.5 bg-danger rounded-full" />}
                                </span>
                                <span className="text-[9px] text-text-tertiary text-mono-operational">{m.date}</span>
                              </div>
                              <h4 className="text-[11.5px] font-semibold text-text-secondary truncate">{m.subject}</h4>
                              <p className="text-[10px] text-text-tertiary truncate leading-none mt-0.5">{m.body}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* CHROME EXTENSION MODAL */}
              {activeModal === "extension" && (
                <div className="flex flex-col h-full">
                  <div className="flex items-center gap-2 mb-3">
                    <ChromeIcon className="w-5 h-5 text-warning" />
                    <div>
                      <h3 className="text-sm font-bold text-text-primary">Chrome Extension Integration</h3>
                      {linkedExtensionToken && <p className="text-[10px] text-text-tertiary">Active Extension Token: {linkedExtensionToken}</p>}
                    </div>
                  </div>

                  <div className="h-px bg-hairline mb-3" />

                  {!linkedExtensionToken ? (
                    <form onSubmit={handleLinkExtension} className="flex-1 flex flex-col justify-center items-center max-w-xs mx-auto text-center space-y-4">
                      <div className="p-3 bg-warning/10 text-warning rounded-full border border-warning/20">
                        <ChromeIcon className="w-6 h-6" />
                      </div>
                      <div className="space-y-1.5">
                        <h4 className="text-xs font-bold text-text-primary">Link Chrome Extension</h4>
                        <p className="text-[10.5px] text-text-tertiary leading-normal">Enter your unique sync token from the extension options page to stream job cards straight to your project workspace.</p>
                      </div>
                      <div className="w-full flex gap-2">
                        <input
                          type="text"
                          required
                          placeholder="e.g. cos-ext-948f"
                          value={inputExtensionToken}
                          onChange={(e) => setInputExtensionToken(e.target.value)}
                          className="flex-1 bg-surface-2 border border-hairline rounded-lg px-3 py-1.5 text-xs text-text-primary focus:outline-hidden"
                        />
                        <button type="submit" className="bg-warning text-canvas font-bold text-xs px-4 py-1.5 rounded-lg cursor-pointer">
                          Link
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex-1 flex flex-col min-h-0 space-y-3">
                      <div className="flex justify-between items-center text-xs bg-surface-2 border border-hairline/60 px-3 py-2 rounded-lg">
                        <span className="text-text-secondary font-medium">Scraper Connection</span>
                        <span className="bg-success/10 text-success border border-success/20 px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wide">ACTIVE</span>
                      </div>

                      <span className="text-[10px] uppercase font-bold text-text-tertiary tracking-wide block">Scraped Job Notification Stream</span>
                      
                      <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
                        {scrapedJobs.map((job) => (
                          <div
                            key={job.id}
                            className="bg-surface-2/60 border border-hairline rounded-xl p-3 flex flex-col gap-2 relative overflow-hidden"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="text-xs font-bold text-text-primary">{job.role}</h4>
                                <p className="text-[10.5px] text-text-secondary mt-0.5">{job.company} · {job.location}</p>
                              </div>
                              <span className="bg-surface-3 border border-hairline text-[8.5px] font-bold text-text-tertiary px-2 py-0.5 rounded-md">
                                {job.source}
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5 flex-wrap text-[9px] text-text-tertiary">
                              <span className="bg-surface-3 px-1.5 py-0.5 rounded">{job.salary}</span>
                              <span className="bg-surface-3 px-1.5 py-0.5 rounded">{job.noticePeriod} Notice</span>
                              <span className="text-success font-bold">Fit Score: {job.fitScore}%</span>
                            </div>

                            <div className="border-t border-hairline/40 pt-2 flex justify-end">
                              {job.imported ? (
                                <span className="text-[10px] text-success font-bold flex items-center gap-1">
                                  <Check className="w-3.5 h-3.5" /> Imported to Tracker
                                </span>
                              ) : (
                                <button
                                  onClick={() => handleImportScrapedJob(job)}
                                  className="bg-primary hover:bg-primary/95 text-white text-[10px] font-bold px-3 py-1 rounded transition-all cursor-pointer flex items-center gap-1 animate-pulse"
                                >
                                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                  </svg> Import to Tracker
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* HELP & SUPPORT MODAL */}
              {activeModal === "help" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-6 h-6 text-text-primary" />
                    <div>
                      <h3 className="text-sm font-bold text-text-primary">Help & Support</h3>
                      <p className="text-[11px] text-text-tertiary">Send feedback or open a support ticket</p>
                    </div>
                  </div>

                  <div className="h-px bg-hairline" />

                  {!helpSubmitted ? (
                    <form onSubmit={handleSubmitHelp} className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[9.5px] uppercase font-bold text-text-tertiary tracking-wide">Subject</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g., Query about resume exports"
                          value={helpSubject}
                          onChange={(e) => setHelpSubject(e.target.value)}
                          className="w-full bg-surface-2 border border-hairline rounded-lg px-3 py-1.5 text-xs text-text-primary focus:outline-hidden focus:border-border-strong"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9.5px] uppercase font-bold text-text-tertiary tracking-wide">Detailed Query / Feedback</label>
                        <textarea
                          required
                          rows={4}
                          placeholder="Please describe your issue or feature request in detail..."
                          value={helpMessage}
                          onChange={(e) => setHelpMessage(e.target.value)}
                          className="w-full bg-surface-2 border border-hairline rounded-lg p-2.5 text-xs text-text-secondary leading-relaxed focus:outline-hidden focus:border-border-strong"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={submittingHelp}
                        className="w-full py-2 bg-text-primary text-background hover:bg-text-secondary font-bold text-xs rounded-lg transition-colors cursor-pointer"
                      >
                        {submittingHelp ? "Submitting..." : "Submit Support Ticket"}
                      </button>
                    </form>
                  ) : (
                    <div className="text-center py-6 space-y-3">
                      <div className="w-12 h-12 rounded-full bg-success/10 border border-success/20 text-success flex items-center justify-center mx-auto">
                        <Check className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-text-primary">Support Ticket Submitted</h4>
                        <p className="text-[10px] text-text-tertiary mt-1">We've logged ticket #{Math.floor(100000 + Math.random() * 900000)}. Our support team will review this shortly.</p>
                      </div>
                      <button
                        onClick={() => setActiveModal(null)}
                        className="px-4 py-1.5 bg-surface-2 border border-hairline hover:bg-surface-3 rounded-lg text-[10px] font-bold text-text-secondary transition-colors cursor-pointer"
                      >
                        Done
                      </button>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function AppShell({ children }: AppShellProps) {
  return (
    <ShellUIProvider>
      <AppShellInner>{children}</AppShellInner>
    </ShellUIProvider>
  );
}
