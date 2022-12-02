export const Custom404Page = () => {
  return (
    <div className="flex flex-1 items-center justify-center grid-in-main">
      <div className="-ml-10 flex items-center">
        <img src="/assets/vaath_frustrated.webp" alt="404" />
        <div>
          <h2 className="mb-1 border-b-2 pb-2 text-4xl font-bold">404</h2>
          <p className="text-lg text-alt-300">Page not found</p>
        </div>
      </div>
    </div>
  )
}

export default Custom404Page
