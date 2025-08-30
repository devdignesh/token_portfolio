import Header from "./components/Header";
import Portfolio from "./components/Portfolio";

function App() {
  return (
    <>
      <div className="min-h-scree">
        <Header />
        <main className="container mx-auto p-4">
          <Portfolio />
        </main>
      </div>
    </>
  );
}

export default App;
