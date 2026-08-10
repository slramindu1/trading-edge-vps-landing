import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">


      <div className="container mx-auto px-4 py-12 max-w-4xl relative">
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center text-primary hover:text-primary/80 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </div>

        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Terms of Use</h1>
            <p className="text-muted-foreground">Last Updated: 11 May, 2025</p>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="lead">
              We strongly encourage you to review these Terms of Use before accessing our website. By continuing to
              browse or interact with this site, you confirm your acceptance of these Terms. If you do not agree, you
              should refrain from using any part of the website or its services.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">Accuracy of Information</h2>
            <p className="mt-4">
              While efforts are made to ensure that the content provided is accurate and up to date, no guarantees are
              made regarding its completeness or reliability. Any use of the information on this platform is done solely
              at your own risk.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">Consent to Electronic Communication</h2>
            <p className="mt-4">
              By registering or engaging with this platform, you agree to receive electronic communications, which may
              include updates, announcements, educational content, or other relevant information. These communications
              may be sent via email or through the platform itself.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">Data Security and User Responsibility</h2>
            <p className="mt-4">
              Reasonable measures are taken to protect user data and maintain platform security. However, no online
              system is entirely secure. By using this platform, you acknowledge that unauthorized access to your data
              is possible and accept full responsibility for any risks involved.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">Services and Offerings</h2>
            <p className="mt-4">
              Some services may be accessible exclusively through the online platform. We aim to represent all content
              and services as clearly and accurately as possible.
            </p>
            <p className="mt-4">
              We reserve the right—but are not obligated—to limit the availability of any service or offering to
              particular individuals, locations, or jurisdictions. This may be determined on a case-by-case basis.
            </p>
            <p className="mt-4">
              Descriptions and pricing for any services or features may be updated or modified at any time, without
              prior notice. We also reserve the right to discontinue any offering at our discretion. Any promotional or
              service-related information is invalid where restricted by law. We do not guarantee that any content,
              service, or product you access will meet your expectations, nor do we ensure that all platform issues or
              errors will be resolved.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">a) Community Access - Discord</h3>
            <p className="mt-4">
              As part of our service, members may gain access to a private Discord community. Continued participation in
              this space is contingent upon compliance with our community standards.
            </p>
            <p className="mt-4">
              Any breach of these rules—available within your member dashboard—may result in immediate removal from the
              Discord server, with or without warning.
            </p>
            <p className="mt-4">
              By agreeing to these Terms, you also agree to abide by all guidelines specific to the Discord community
              and acknowledge that failure to comply may result in revoked access.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">Changes to Services and Pricing</h2>
            <p className="mt-4">
              All pricing and service offerings provided are subject to change at any time, without prior announcement.
              We reserve the right to adjust, update, or discontinue any aspect of the services—including content,
              tools, or features—at our sole discretion and without obligation to notify users in advance.
            </p>
            <p className="mt-4">
              We are not responsible to you or any third party for any adjustments to pricing, changes to the service,
              or discontinuation of features.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">Termination</h2>
            <p className="mt-4">
              We reserve the right to suspend or terminate your access to the platform, services, or community without
              prior notice if you violate any part of these Terms of Use, including but not limited to sharing
              restricted content or failing to meet payment obligations.
            </p>
            <p className="mt-4">
              Any outstanding dues up to the date of termination remain your responsibility. Termination will result in
              the immediate loss of access to all courses, content, and the associated Discord Community.
            </p>
            <p className="mt-4">
              If you choose to stop using our services, you may notify us at any time. Please note that termination by
              either party does not affect any rights or obligations that arose before the termination date.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">Refund Policy</h2>
            <p className="mt-4">
              Please note that all sales are considered final. As our offerings consist of digital educational content
              that can be accessed and retained immediately, we do not offer refunds for any reason.
            </p>
            <p className="mt-4">By making a purchase, you confirm your understanding and acceptance of this policy.</p>
            <p className="mt-4">
              If you have any questions or need further clarification about what is included in your purchase, feel free
              to contact us before completing your order.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Information</h2>
            <p className="mt-4">
              For any questions regarding these Terms, our services, or support inquiries, please contact us at:{" "}
              <a href="mailto:info@tradingedgefx.com" className="text-primary hover:underline">
                info@tradingedgefx.com
              </a>
            </p>
            <p className="mt-4">We aim to respond to all inquiries in a timely manner.</p>
          </div>

          <div className="border-t pt-8 text-sm text-muted-foreground">
            <p className="mt-4">Last Updated: 11 May, 2025</p>
          </div>
        </div>
      </div>
    </div>
  )
}