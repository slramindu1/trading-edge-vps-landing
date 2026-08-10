import { Container, Icons, Wrapper } from "@/components";
import { BorderBeam } from "@/components/ui/border-beam";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LampContainer } from "@/components/ui/lamp";
import Marquee from "@/components/ui/marquee";
import SectionBadge from "@/components/ui/section-badge";
import {
  features,
  perks,
  pricingCards,
  reviews,
  faqs,
  curiculam,
  galleryItems,
} from "@/constants";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Badge,
  CheckCircle,
  ChevronRight,
  CirclePlay,
  UserIcon,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const HomePage = () => {
  const firstRow = reviews.slice(0, reviews.length / 2);
  const secondRow = reviews.slice(reviews.length / 2);

  return (
    <section className="w-full relative flex items-center justify-center flex-col px-4 md:px-0 py-8">
      {/* hero */}
      <Wrapper>
        <div className="absolute inset-0 dark:bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[linear-gradient(to_right,#161616_1px,transparent_1px),linear-gradient(to_bottom,#161616_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] -z-10 h-[150vh]" />

        <Container>
          <div className="flex flex-col items-center justify-center py-20 h-full">
            <button className="group relative grid overflow-hidden rounded-full px-4 py-1 shadow-[0_1000px_0_0_hsl(0_0%_20%)_inset] transition-colors duration-200">
              <span>
                <span className="spark mask-gradient absolute inset-0 h-[100%] w-[100%] animate-flip overflow-hidden rounded-full [mask:linear-gradient(white,_transparent_50%)] before:absolute before:aspect-square before:w-[200%] before:rotate-[-90deg] before:animate-rotate before:bg-[conic-gradient(from_0deg,transparent_0_340deg,white_360deg)] before:content-[''] before:[inset:0_auto_auto_50%] before:[translate:-50%_-15%]" />
              </span>
              <span className="backdrop absolute inset-[1px] rounded-full bg-neutral-950 transition-colors duration-200 group-hover:bg-neutral-900" />
              <span className="h-full w-full blur-md absolute bottom-0 inset-x-0 bg-gradient-to-tr from-primary/40"></span>
              <span className="z-10 py-0.5 text-sm text-neutral-100 flex items-center justify-center gap-1.5">
                <Image
                  src="/icons/sparkles-dark.svg"
                  alt="✨"
                  width={24}
                  height={24}
                  className="w-4 h-4"
                />
                Introducing Trading Edge
                <ChevronRight className="w-4 h-4" />
              </span>
            </button>

            <div className="flex flex-col items-center mt-8 max-w-5xl w-11/12 md:w-full">
              <h1 className="text-4xl md:text-6xl lg:textxl md:!leading-snug font-semibold text-center bg-clip-text bg-gradient-to-b from-gray-50 to-gray-50 text-transparent">
                Become A Consistent Profitable Fx Trader With Our Mechanical
                Trading System
              </h1>
              <p className="text-base md:text-lg text-foreground/80 mt-6 text-center">
                Trading Edge is a comprehensive educational program focused on
                the foreign exchange market in Sri Lanka. It is taught in a very
                simple Sinhala Medium. As a member, you can start this program
                without any prior experience. You will gain all the necessary
                theoretical and practical knowledge from the experiences of the
                mentors to become a consistent profitable trader in the long
                term.
              </p>
              <div className="hidden md:flex relative items-center justify-center mt-8 md:mt-12 w-full">
                <Link
                  href="#pricing"
                  className="flex items-center justify-center w-max rounded-full border-t border-foreground/30 bg-white/20 backdrop-blur-lg px-2 py-1 md:py-2 gap-2 md:gap-8 shadow-3xl shadow-background/40 cursor-pointer select-none"
                >
                  <p className="text-foreground text-sm text-center md:text-base font-medium pl-4 pr-4 lg:pr-0">
                    ✨ {"  "} Start Your Trading Journey!
                  </p>

                  <Button
                    size="sm"
                    className="rounded-full hidden lg:flex border border-foreground/20"
                  >
                    Get Started
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative flex items-center py-10 md:py-20 w-full">
              <div className="absolute top-1/2 left-1/2 -z-10 gradient w-3/4 -translate-x-1/2 h-3/4 -translate-y-1/2 inset-0 blur-[10rem]"></div>

              <div className="-m-2 rounded-xl p-2 ring-1 ring-inset ring-foreground/20 lg:-m-4 lg:rounded-2xl bg-opacity-50 backdrop-blur-3xl w-full">
                <div className="aspect-video w-full rounded-md lg:rounded-xl overflow-hidden bg-foreground/10 shadow-2xl ring-1 ring-border">
                  <iframe
                    src="https://iframe.mediadelivery.net/embed/382750/5064b8be-24d1-4c1e-a3bd-d8d508edd1a5?autoplay=false&controls=true"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                </div>

                <BorderBeam size={250} duration={15} delay={9} />
              </div>
            </div>
          </div>
        </Container>
      </Wrapper>

      {/* Testimonials*/}
      {/* <Wrapper className="flex flex-col items-center justify-center py-12 relative">
        <Container>
          <div className="max-w-md mx-auto text-start md:text-center">
            <SectionBadge title="Testimonials" />
            <h2 className="text-3xl lg:text-4xl font-semibold mt-6">
              Customer testimonials
            </h2>
            <p className="text-muted-foreground mt-6">
              View Our Course Best Student Reviews
            </p>
          </div>
        </Container>

        <Container>
          <div className="flex flex-col items-center justify-center py-10 md:py-20 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full divide-x-0 md:divide-x divide-y md:divide-y-0 divide-gray-900 first:border-l-2 lg:first:border-none first:border-gray-900">
              {perks.map((perk) => (
                <div
                  key={perk.title}
                  className="flex flex-col items-start px-4 md:px-6 lg:px-8 lg:py-6 py-4"
                >
                  <div className="flex items-center justify-center">
                    <perk.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-medium mt-4">{perk.title}</h3>
                  <p className="text-muted-foreground mt-2 text-start lg:text-start">
                    {perk.info}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Wrapper> */}

      {/*Our Customers*/}
      <Wrapper
        id="customers"
        className="flex flex-col items-center justify-center py-12 relative"
      >
        <div className="hidden md:block absolute -top-1/4 -left-1/3 w-72 h-72 bg-indigo-500 rounded-full blur-[10rem] -z-10"></div>
        <Container>
          <div className="max-w-md mx-auto text-start md:text-center">
            <SectionBadge title="Our Customers" />
            <h2 className="text-3xl lg:text-4xl font-semibold mt-6">
              What people are saying
            </h2>
            <p className="text-muted-foreground mt-6">
              See how empowers businesses of all sizes. Here&apos;s what real
              people are saying on Twitter
            </p>
          </div>
        </Container>
        <Container>
          <div className="py-10 md:py-20 w-full">
            <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden py-10">
              <Marquee pauseOnHover className="[--duration:20s] select-none">
                {firstRow.map((review) => (
                  <figure
                    key={review.name}
                    className={cn(
                      "relative w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
                      "border-zinc-50/[.1] bg-background over:bg-zinc-50/[.15]"
                    )}
                  >
                    <div className="flex flex-row items-center gap-2">
                      <UserIcon className="w-6 h-6" />
                      <div className="flex flex-col">
                        <figcaption className="text-sm font-medium">
                          {review.name}
                        </figcaption>
                        <p className="text-xs font-medium text-muted-foreground">
                          {review.username}
                        </p>
                      </div>
                    </div>
                    <blockquote className="mt-2 text-sm">
                      {review.body}
                    </blockquote>
                  </figure>
                ))}
              </Marquee>
              <Marquee
                reverse
                pauseOnHover
                className="[--duration:20s] select-none"
              >
                {secondRow.map((review) => (
                  <figure
                    key={review.name}
                    className={cn(
                      "relative w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
                      "border-zinc-50/[.1] bg-background over:bg-zinc-50/[.15]"
                    )}
                  >
                    <div className="flex flex-row items-center gap-2">
                      <UserIcon className="w-6 h-6" />
                      <div className="flex flex-col">
                        <figcaption className="text-sm font-medium">
                          {review.name}
                        </figcaption>
                        <p className="text-xs font-medium text-muted-foreground">
                          {review.username}
                        </p>
                      </div>
                    </div>
                    <blockquote className="mt-2 text-sm">
                      {review.body}
                    </blockquote>
                  </figure>
                ))}
              </Marquee>
              <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-background"></div>
              <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-background"></div>
            </div>
          </div>
        </Container>
      </Wrapper>

      {/* features */}
      <Wrapper
        id="features"
        className="flex flex-col items-center justify-center py-12 relative"
      >
        <div className="hidden md:block absolute top-0 -right-1/3 w-72 h-72 bg-primary rounded-full blur-[10rem] -z-10"></div>
        <div className="hidden md:block absolute bottom-0 -left-1/3 w-72 h-72 bg-indigo-600 rounded-full blur-[10rem] -z-10"></div>
        <Container>
          <div className="max-w-md mx-auto text-start md:text-center">
            <SectionBadge title="Features" />
            <h2 className="text-3xl lg:text-4xl font-semibold mt-6">
              Build Your Trading Skills & Getting Funded
            </h2>
            <p className="text-muted-foreground mt-6">
              Trading Edge offers a range of features to help you build a
              stunning website in no time
            </p>
          </div>
        </Container>
        <Container>
          <div className="flex items-center justify-center mx-auto mt-8">
            <Icons.feature className="w-auto h-80" />
          </div>
        </Container>
        <Container>
          <div className="flex flex-col items-center justify-center py-10 md:py-20 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 w-full gap-6">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="flex flex-col items-start px-6 py-6 border border-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 bg-background"
                >
                  <div className="flex items-center justify-center mb-2">
                    <feature.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium mt-2">{feature.title}</h3>
                  <p className="text-muted-foreground mt-2 text-start">
                    {feature.info}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Wrapper>

      {/* {Whats Incldued Membership} */}
      <Wrapper
        id="membership"
        className="flex flex-col items-center justify-center py-12 relative"
      >
        <Container className="flex flex-col items-center justify-center px-4">
          <div className="max-w-md mx-auto text-center">
            <SectionBadge title="Our Membership" />
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold mt-6">
              What&apos;s Included In The Membership
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mt-4">
              Learn More About Our Membership
            </p>
          </div>
        </Container>

        <Container>
          <div className="absolute inset-0 opacity-20 z-0"></div>

          <div className="container mx-auto px-4 py-8 relative z-10">
            {/* Section 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="relative z-10">
                <Image
                  src="/assets/poster1.png"
                  alt="The Fanatic Way Course Preview"
                  width={600}
                  height={600}
                  className="rounded-lg w-full"
                />
              </div>

              <div className="space-y-6">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
                  Trading Edge Course
                </h1>
                <p className="text-base sm:text-lg text-primary">
                  A NO BS Trading Course! No Guessing, 12 modules, 180
                  comprehensive lessons.
                </p>
                <p className="text-sm sm:text-base">
                  Our complete framework aligns with all market types including
                  Forex, Crypto, Indices, and Futures, eliminating all the noise
                  and errors you&apos;ve learned so far.
                </p>

                <div className="space-y-3">
                  <h3 className="text-base sm:text-lg font-bold">Results:</h3>
                  <ul className="space-y-2 text-sm sm:text-base">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="text-primary h-5 w-5 mt-0.5" />
                      <span>
                        Complete clarity and confidence when analyzing charts.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="text-primary h-5 w-5 mt-0.5" />
                      <span>
                        Obtain discipline to stop overtrading and hesitating.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="text-primary h-5 w-5 mt-0.5" />
                      <span>
                        Learn when to wait, enter, manage, and exit trades.
                      </span>
                    </li>
                  </ul>

                  <div className="flex flex-col sm:flex-row gap-4 mt-4">
                    <Button
                      size="lg"
                      className="bg-primary hover:bg-primary/90"
                    >
                      ENROLL NOW
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mt-8">
              <div className="space-y-6">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
                  Trading Edge Flix
                </h1>
                <p className="text-base sm:text-lg text-primary">
                  40+ Hours Of Content, Unique Dashboard
                </p>
                <p className="text-sm sm:text-base">
                  Unlock your personalized approach with a dashboard featuring
                  40+ hours of updated content.
                </p>
                <p className="text-sm sm:text-base">
                  Learn to become a consistently profitable trader by adapting
                  to changing market conditions through real analysis and
                  markups.
                </p>

                <h3 className="text-base sm:text-lg font-bold">
                  Key Benefits:
                </h3>
                <ul className="space-y-2 text-sm sm:text-base">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-primary h-5 w-5 mt-0.5" />
                    <span>
                      See profitable strategies in action via live trading.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-primary h-5 w-5 mt-0.5" />
                    <span>Review your performance.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-primary h-5 w-5 mt-0.5" />
                    <span>Learn to combine all strategies effectively.</span>
                  </li>
                </ul>

                <div className="flex flex-col sm:flex-row gap-4 mt-4">
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    ENROLL NOW!
                  </Button>
                </div>
              </div>

              <div className="relative z-10">
                <Image
                  src="/assets/poster1.png"
                  alt="The Fanatic Way Course Preview"
                  width={600}
                  height={600}
                  className="rounded-lg w-full"
                />
              </div>
            </div>

            {/* Section 3 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="relative z-10">
                <Image
                  src="/assets/poster1.png"
                  alt="The Fanatic Way Course Preview"
                  width={600}
                  height={600}
                  className="rounded-lg w-full"
                />
              </div>

              <div className="space-y-6">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
                  Trading Edge Community
                </h1>
                <p className="text-base sm:text-lg text-primary">
                  40+ Hours Of Content, Unique Dashboard
                </p>
                <p className="text-sm sm:text-base">
                  Access to our team, Daily Analysis, and trading breakdowns of
                  currency pairs and indices.
                </p>

                <p className="text-sm sm:text-base">
                  Connect with traders on Discord, get mentorship, learn
                  insights, and grow with a community.
                </p>

                <h3 className="text-base sm:text-lg font-bold">Benefits:</h3>
                <ul className="space-y-2 text-sm sm:text-base">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-primary h-5 w-5 mt-0.5" />
                    <span>Share ideas with successful traders.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-primary h-5 w-5 mt-0.5" />
                    <span>
                      Access daily market analysis and trade breakdowns.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-primary h-5 w-5 mt-0.5" />
                    <span>Receive 1:1 coaching support consistently.</span>
                  </li>
                </ul>

                <div className="flex flex-col sm:flex-row gap-4 mt-4">
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    ENROLL NOW!
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Wrapper>

      {/* Course Curiculam */}
      <Wrapper
        id="curriculum"
        className="flex flex-col items-center justify-center py-12 relative"
      >
        <div className="hidden md:block absolute top-0 -right-1/3 w-72 h-72 bg-blue-500 rounded-full blur-[10rem] -z-10"></div>
        <Container className="flex flex-col items-center justify-center">
          <div className="max-w-md mx-auto text-center">
            <SectionBadge title="Course Curiculam" />
            <h2 className="text-3xl lg:text-4xl font-semibold mt-6">
              Course Curriculam
            </h2>
            <p className="text-muted-foreground mt-6">
              Choose the best plan for your Trading Journey and start Learning
              your Trading Mentorship today
            </p>
          </div>
        </Container>
        <Container>
          <div className="flex flex-col items-center justify-center py-10 md:py-20 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full gap-6">
              {curiculam.map((curiculam) => (
                <div
                  key={curiculam.title}
                  className="flex flex-col items-start px-6 py-6 border border-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 bg-background"
                >
                  <div className="flex items-center justify-center mb-2">
                    {/* <perk.icon className="w-8 h-8" /> */}
                    <h2 className="text-primary text-base font-semibold">
                      {curiculam.heading}
                    </h2>
                  </div>
                  <h3 className="text-lg font-medium mt-2">
                    {curiculam.title}
                  </h3>
                  <p className="text-muted-foreground mt-2 text-start">
                    {curiculam.info}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Wrapper>

      {/* {testimonails section 2} */}
      <Wrapper id="results">
        <div className="hidden md:block absolute top-0 -right-1/3 w-72 h-72 bg-blue-500 rounded-full blur-[10rem] -z-10"></div>
        <Container className="flex flex-col items-center justify-center">
          <div className="max-w-md mx-auto text-center">
            <SectionBadge title="Our Result" />
            <h2 className="text-3xl lg:text-4xl font-semibold mt-6">
              We worked with thousands of amazing people
            </h2>
            <p className="text-muted-foreground mt-6">
              You Can Read And Understand Our Student Comments
            </p>
          </div>
        </Container>

        <Container className="mt-16">
          <section className="use-automation-zoom-in py-10 px-4">
            <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
              {[
                "/assets/5.jpg",
                "/assets/2.jpg",
                "/assets/3.jpg",
                "/assets/4.jpg",
                "/assets/1.jpg",
                "/assets/6.jpg",
                "/assets/7.jpg",
                "/assets/8.jpg",
                "/assets/9.jpg",
                "/assets/10.jpg",
                "/assets/11.jpg",
                "/assets/12.jpg",
                "/assets/13.jpg",
                "/assets/14.jpg",
                "/assets/15.jpg",
                "/assets/16.jpg",
              ].map((src, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-2xl shadow-lg mb-4 break-inside-avoid group relative"
                >
                  <Image
                    src={src}
                    alt={`Image ${index + 1}`}
                    width={600}
                    height={400}
                    className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </section>
        </Container>
      </Wrapper>

      {/* pricing */}
      <Wrapper
        id="pricing"
        className="flex flex-col items-center justify-center py-12 relative"
      >
        <div className="hidden md:block absolute top-0 -right-1/3 w-72 h-72 bg-blue-500 rounded-full blur-[10rem] -z-10"></div>
        <Container className="flex flex-col items-center justify-center">
          <div className="max-w-md mx-auto text-center">
            <SectionBadge title="Pricing" />
            <h2 className="text-3xl lg:text-4xl font-semibold mt-6">
              Unlock the right plan for your Trading Journey
            </h2>
            <p className="text-muted-foreground mt-6">
              Choose the best plan for your Trading Journey and start Learning
              your Trading Mentorship today
            </p>
          </div>
        </Container>
        <Container className="flex flex-col items-center justify-center">
          <div className="w-full flex justify-center py-10 md:py-20">
            <div className="grid grid-cols-1 gap-5 md:gap-8 max-w-4xl w-full place-items-center">
              {pricingCards.map((card) => (
                <Card
                  key={card.title}
                  className={cn(
                    "flex flex-col w-full max-w-sm border-neutral-700",
                    card.title === "Unlimited Saas" && "border-2 border-primary"
                  )}
                >
                  <CardHeader className="border-b border-border">
                    <span>{card.title}</span>
                    <CardTitle
                      className={cn(
                        card.title !== "Unlimited Saas" &&
                          "text-muted-foreground"
                      )}
                    >
                      {card.price}
                    </CardTitle>
                    <CardDescription>{card.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-3">
                    {card.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-2">
                        <Zap className="w-4 h-4 fill-primary text-primary" />
                        <p>{feature}</p>
                      </div>
                    ))}
                  </CardContent>
                  <CardFooter className="mt-auto">
                    <Link
                      href="/checkout" // ← HERE: Redirects to the /checkout page
                      className={cn(
                        "w-full text-center text-primary-foreground bg-primary p-2 rounded-md text-sm font-medium",
                        card.title !== "Unlimited Saas" &&
                          "!bg-foreground !text-background"
                      )}
                    >
                      {card.buttonText}
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </Container>
      </Wrapper>

      {/* testimonials before section*/}

      {/* FAQ Section */}
      <Wrapper
        id="faq"
        className="flex flex-col items-center justify-center relative"
      >
        <Container>
          <div className="max-w-md mx-auto text-center">
            <SectionBadge title="FAQ" />
            <h2 className="text-3xl lg:text-4xl font-semibold mt-6">
              We are here to answer all your questions.
            </h2>
            <p className="text-muted-foreground mt-4">
              If you are new to Genie or looking to supercharge your current
              stack, this section will help you learn more about the platform
              and it s features.
            </p>
          </div>

          {/* Accordion */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto w-full">
            {faqs.map((item, index) => (
              <div
                key={index}
                className="border border-border rounded-lg overflow-hidden shadow-sm"
              >
                <details className="group p-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between font-medium text-foreground">
                    {item.question}
                    <ChevronRight className="h-5 w-5 transition-transform group-open:rotate-90" />
                  </summary>
                  <p className="mt-2 text-muted-foreground text-sm">
                    {item.answer}
                  </p>
                </details>
              </div>
            ))}
          </div>
          {/* Contact Us Button */}
          <div className="flex flex-col items-center justify-center mt-12">
            <p className="text-muted-foreground text-sm mb-4">
              Got any more questions?
            </p>
            <Button variant="white" className="mt-6" asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </Container>
      </Wrapper>

      {/* newsletter */}
      <Wrapper className="flex flex-col items-center justify-center py-12 relative">
        <Container>
          <LampContainer>
            <div className="flex flex-col items-center justify-center relative w-full text-center">
              <h2 className="text-4xl lg:text-5xl xl:text-6xl lg:!leading-snug font-semibold mt-8">
                Master FX Trading and <br /> Unlock Financial Freedom
              </h2>
              <p className="text-muted-foreground mt-6 max-w-md mx-auto">
                Learn proven strategies, risk management, and real-world skills
                with our expert-led FX Trading course.
              </p>
              <Button variant="white" className="mt-6" asChild>
                <Link href="/sign-in">
                  Start Learning Now
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </LampContainer>
        </Container>

        <Container className="relative z-[999999]">
          <div className="flex items-center justify-center w-full -mt-40">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-start md:justify-between w-full px-4 md:px-8 rounded-lg lg:rounded-2xl border border-border/80 py-4 md:py-8">
              <div className="flex flex-col items-start gap-4 w-full">
                <h4 className="text-xl md:text-2xl font-semibold">
                  Join our newsletter
                </h4>
                <p className="text-base text-muted-foreground">
                  Be up to date with everything about AI builder
                </p>
              </div>
              <div className="flex flex-col items-start gap-2 md:min-w-80 mt-5 md:mt-0 w-full md:w-max">
                <form
                  action="#"
                  className="flex flex-col md:flex-row items-center gap-2 w-full md:max-w-xs"
                >
                  <Input
                    required
                    type="email"
                    placeholder="Enter your email"
                    className="focus-visible:ring-0 focus-visible:ring-transparent focus-visible:border-primary duration-300 w-full"
                  />
                  <Button
                    type="submit"
                    size="sm"
                    variant="secondary"
                    className="w-full md:w-max"
                  >
                    Subscribe
                  </Button>
                </form>
                <p className="text-xs text-muted-foreground">
                  By subscribing you agree with our{" "}
                  <Link href="#">Privacy Policy</Link>
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Wrapper>
    </section>
  );
};

export default HomePage;
