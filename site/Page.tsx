import Shutter from "./components/Shutter";
import Rail from "./components/Rail";
import Hero from "./components/Hero";
import Wipe from "./components/Wipe";
import Rooms from "./components/Rooms";
import Services from "./components/Services";
import Gear from "./components/Gear";
import Sessions from "./components/Sessions";
import Booking from "./components/Booking";
import Footer from "./components/Footer";

export default function Page() {
  return (
    <>
      <Shutter />
      <Rail />
      <main>
        <Hero />
        <Wipe />
        <Rooms />
        <Services />
        <Gear />
        <Sessions />
        <Booking />
      </main>
      <Footer />
    </>
  );
}
