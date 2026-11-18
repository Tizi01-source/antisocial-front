// Componente que representa el logo de la aplicación.

type LogoProps = {
  size?: number
}

export default function Logo({ size = 32 }: LogoProps) {
  return (
      <>
        <img src="/img/logo-claro.svg" alt="Logo Anti-Social Net" width={size} className="logo-claro" />
        <img src="/img/logo-oscuro.svg" alt="Logo Anti-Social Net" width={size} className="logo-oscuro" />
      </>
  )
}