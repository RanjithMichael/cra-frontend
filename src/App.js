function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <header className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-blue-400">Car Rental App</h1>
        <p className="text-lg">
          🚗 Powered by React + TailwindCSS
        </p>
        <a
          className="inline-block mt-4 px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-semibold transition"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
