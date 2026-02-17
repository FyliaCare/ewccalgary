export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-ewc-burgundy-50 via-white to-ewc-cream">
      <div className="text-center px-6">
        <div className="text-6xl mb-6">📡</div>
        <h1 className="font-heading font-bold text-3xl text-ewc-charcoal mb-3">
          You&apos;re Offline
        </h1>
        <p className="text-ewc-silver max-w-md mx-auto mb-8">
          It looks like you&apos;ve lost your internet connection. Please check your
          connection and try again.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="btn-burgundy"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
