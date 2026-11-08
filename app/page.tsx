import Hero from "./components/hero";
import Nav from "./components/Nav";
import Listing from "./components/listing";
import Footer from "./components/footer";

export default function Home() {
  return (
    <>
    <div>
      <Nav/>
      <Hero/>
      <Listing/>
      <Footer/>

    </div>
    </>

  );
}
