import Head from "next/head";
import { useRouter } from "next/router";
import nookies from "nookies";
import Loader from "../components/loader";

export default function Home(props) {
  return (
    <div>
      <Head>
        <title>Admin Panel | Home</title>
        <meta name="description" content="Admin Login Page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Loader />
    </div>
  );
}

export async function getServerSideProps(ctx) {
  const cookies = nookies.get(ctx);

  if (!cookies.token) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    redirect: {
      destination: "/admin/dashboard/home",
      permanent: false,
    },
  };
}
