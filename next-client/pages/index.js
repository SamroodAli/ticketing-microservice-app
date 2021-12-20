import Link from "next/link";
import buildClient from "../api/build-client";
const LandingPage = ({ currentUser, tickets }) => {
  const ticketList = tickets.map((ticket) => {
    console.log(ticket.id);
    return (
      <tr key={ticket.id}>
        <td>{ticket.title}</td>
        <td>{ticket.price}</td>
        <td>
          <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
            <a>View</a>
          </Link>
        </td>
      </tr>
    );
  });

  return (
    <div>
      <h1>Tickets</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Links</th>
          </tr>
        </thead>
        <tbody>{ticketList}</tbody>
      </table>
    </div>
  );
};

export const getServerSideProps = async (context) => {
  try {
    const { data } = await buildClient(context).get("/api/tickets");
    return {
      props: {
        tickets: data,
      },
    };
  } catch (error) {
    return {
      props: {
        tickets: [],
      },
    };
  }
};

export default LandingPage;
