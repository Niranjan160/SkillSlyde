import Hero from "../components/Hero"
import HomeCards from "../components/HomeCards"
import JobListings from "../components/JobListings"
import ViewAllJobs from "../components/ViewAllJobs"
import FloatingChatButton from "../components/FloatingChatButton"
const HomePage = () => {
  return (
    <>
    <Hero/>
    <HomeCards/>
    <JobListings isHome={true}/>
    <ViewAllJobs/>
    <FloatingChatButton/>
    </>
  )
}

export default HomePage