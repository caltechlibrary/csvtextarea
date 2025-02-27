import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const contentTypes = {
  ".html": "text/html",
  ".js": "application/javascript",
};

serve(async (req) => {
  const url = new URL(req.url, `http://${req.headers.get("host")}`);

  // Check if the request is a WebSocket upgrade
  if (req.headers.get("upgrade") === "websocket") {
    const { socket, response } = Deno.upgradeWebSocket(req);
    socket.addEventListener("open", () => {
      console.log("A client connected!");
    });

    socket.addEventListener("message", (event) => {
      if (event.data === "ping") {
        socket.send("pong");
      }
    });

    return response;
  }

  // Handle form submission
  if (url.pathname === "/submit" && req.method === "POST") {
    const formData = await req.formData();
    const csvData = formData.get("csv-data");
    console.log("Received CSV Data:", csvData);
    return new Response("CSV data received", { status: 200 });
  }

  // Serve static files
  let filePath;
  if (url.pathname === "/") {
    filePath = "index.html";
  } else {
    filePath = url.pathname.substring(1); // Remove leading slash
  }

  try {
    const file = await Deno.readFile(filePath);
    const contentType = contentTypes[filePath.match(/\.[^.]+$/)[0]] || "text/plain";
    return new Response(file, {
      headers: { "content-type": contentType },
    });
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      return new Response("File not found", { status: 404 });
    } else {
      return new Response("Internal Server Error", { status: 500 });
    }
  }
});

console.log("Server running on http://localhost:8000");
