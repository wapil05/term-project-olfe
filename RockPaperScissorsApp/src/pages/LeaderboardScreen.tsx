import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import { usersAtom, socketAtom } from "../components/states";

function LeaderboardScreen() {
  const [users, setUsers] = useAtom(usersAtom);
  const [socket] = useAtom(socketAtom);
  const navigate = useNavigate();

  async function getUsers() {
    const response = await fetch("http://localhost:3000/users");
    const data = await response.json();

    setUsers(data);
  }

  useEffect(() => {
    getUsers();
    socket.on("gameDone", () => {
      getUsers();
    });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center">
      <button
        className="absolute top-4 right-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => {
          navigate("/home");
        }}
      >
        Home
      </button>
      <h1 className="text-2xl font-bold mb-4">Leaderboard</h1>
      <div className="overflow-x-auto">
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Wins
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Losses
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rounds Won
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rounds Lost
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Flawless Victories
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.wins}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.losses}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {user.roundsWon}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {user.roundsLost}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {user.flawlessVictories}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LeaderboardScreen;
