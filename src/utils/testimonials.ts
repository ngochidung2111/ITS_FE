export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatarUrl: string;
  content: string;
  rating: number;
}
const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Pritish Sahoo",
    role: "Software Engineer",
    company: "Highradius",
    avatarUrl: "/images/Pritish.png",
    content: "ITS has completely transformed my career. I went from a junior developer to a team lead in just 8 months after completing their React and Node.js courses. The quality of instruction and hands-on projects are unmatched.",
    rating: 5
  },
  {
    id: "t2",
    name: "Saptarshi Sarkar",
    role: "UX Designer",
    company: "IBM",
    avatarUrl: "/images/saptarshi.png",
    content: "As someone with no prior design experience, I was intimidated to start learning UX design. The UI/UX Design Masterclass on ITS made complex concepts accessible and helped me build a portfolio that landed me my dream job.",
    rating: 5
  },
  {
    id: "t3",
    name: "Nikhil Soni",
    role: "Data Scientist",
    company: "Microsoft",
    avatarUrl: "/images/nikhil.png",
    content: "The Data Science and Machine Learning Bootcamp is worth every penny. Saket's teaching style is exceptional - he breaks down complex algorithms into understandable chunks. I'm now confidently building ML models for my company.",
    rating: 5
  },
  {
    id: "t4",
    name: "Aditya Shrivastava",
    role: "Full Stack Developer",
    company: "Meta",
    avatarUrl: "/images/aditya.jpg",
    content: "I've tried many online learning platforms, but ITS stands out for the depth of content and instructor quality. The Python bootcamp helped me automate tasks at work, saving my team countless hours.",
    rating: 4
  },
  {
    id: "t5",
    name: "Raja Kumar Rana",
    role: "iOS Developer",
    company: "Apple inc.",
    avatarUrl: "/images/Raja.png",
    content: "The iOS development course was exactly what I needed to transition from web to mobile development. Within weeks of completing the course, I published my first app on the App Store, which now has over 10,000 downloads!",
    rating: 5
  }
  ,
  {
    id: "t6",
    name: "Saket Kumar Sinha",
    role: "Founder & CEO",
    company: "ITS",
    avatarUrl: "/images/saket.jpg",
    content: "As the founder of ITS, I am passionate about making quality education accessible to everyone. Our platform is built on the belief that with the right guidance and resources, anyone can achieve their learning goals.",
    rating: 5
  }
];
export default testimonials;