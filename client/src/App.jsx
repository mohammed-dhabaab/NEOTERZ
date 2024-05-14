import styles from "./styles";
import Home from './pages/Home/Home'
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Demo from "././pages/Demo/Demo"
import { Navbar } from "./components"
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
import Contact from "./pages/Contact/Contact";


const AppLayout = () => {
  return (
    <div className={`${styles.paddingX} ${styles.flexCenter}`}>
      <div className={`${styles.boxWidth}`}>
        <Navbar />
        <Outlet />
      </div>
    </div>
  )
}

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "contact",
        element: <Contact/>
      },
      {
        path: "demo",
        element: <Demo />,
      }
    ]
  }
])

const App = () => (
  <div className="bg-primary overflow-hidden">
    <RouterProvider router={router} />
  </div>
);

export default App;