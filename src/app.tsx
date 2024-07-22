import { createRoot } from "react-dom/client";
import Home from "./routes/home/home";
import { ChakraProvider } from "@chakra-ui/react";
import "./index.css";

const root = createRoot(document.body);
root.render(
  <ChakraProvider>
    <Home />
  </ChakraProvider>
);
