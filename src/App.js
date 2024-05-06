import "./App.css";
import Layout from "./components/layout/Layout";
import CalculatorView from "./components/calculator/CalculatorView";
import Header from "./components/layout/utils/Header";
import Sidebar from "./components/layout/utils/Sidebar";
import CalculatorContextProvider from "./context/CalculatorContextProvider";
import { ReactFlowProvider } from "reactflow";
function App() {
  return (
    <div className="App">
      <Layout>
        <div className="h-[50px]">
          <Header />
        </div>
        <div className={`flex h-[calc(100vh-50px)]`}>
          <ReactFlowProvider>
            <CalculatorContextProvider>
              <Sidebar />
              <CalculatorView />
            </CalculatorContextProvider>
          </ReactFlowProvider>
        </div>
      </Layout>
    </div>
  );
}

export default App;
