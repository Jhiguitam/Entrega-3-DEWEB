import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 sm:p-20">
      <main className="flex flex-col items-center gap-8">
        <Image
          src="/images/perfil_heroe/hero_profile.jpg"
          alt="Imagen de perfil del héroe"
          width={180}
          height={180}
          priority
        />
        <h1 className="text-3xl font-bold">Bienvenido a la Plataforma de Héroes</h1>
        <p className="text-center max-w-md">
          Descubre a nuestros héroes y accede a perfiles personalizados donde puedes realizar pagos y conocer sus estadísticas.
        </p>
        <a
          className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-green-500 text-white hover:bg-green-600 text-sm sm:text-base h-12 px-5"
          href="/perfil_heroe"
        >
          Ir al Perfil de Héroe
        </a>
      </main>
    </div>
  );
}
