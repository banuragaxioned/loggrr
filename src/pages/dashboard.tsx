import { Layout } from "@/components/layout";

export default function Dashboard() {
  return (
    <Layout>
      <section>
        <div>
          <h1>
            Beautifully designed components <br className="hidden sm:inline" />
            built with Radix UI and Tailwind CSS.
          </h1>
          <p>
            Accessible and customizable components that you can copy and paste
            into your apps. Free. Open Source. And Next.js 13 Ready.
          </p>
        </div>
      </section>
    </Layout>
  );
}
