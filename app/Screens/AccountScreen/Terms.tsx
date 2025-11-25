import { View, Text, ScrollView, StyleSheet, Linking } from "react-native";
import ScreenWrapper from "@/common/ScreenWrapper";
import Header from "@/common/Header";

const TermsAndConditionsScreen = () => {
  const handleCallPress = () => {
    Linking.openURL("tel:+07478687182");
  };
  return (
    <ScreenWrapper>
      <Header title="Terms & condition" />
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.paddingH}>
            <View style={styles.card}>
              <Text style={styles.title}>Customer Terms and Conditions</Text>
              <Text style={styles.effectiveDate}>
                Effective Date: November 10, 2025
              </Text>
              <Text style={styles.lastUpdated}>
                Last Updated: November 10, 2025
              </Text>

              <View style={styles.importantNotice}>
                <Text style={styles.noticeText}>
                  IMPORTANT NOTICE: These Terms and Conditions constitute a
                  legally binding agreement between you (the "Customer" or
                  "User") and Afrobasket Express Technology Limited (the
                  "Company", "ABX", "we", "us", or "our"). By accessing or using
                  the ABX Customer Website (the "Website"), you acknowledge that
                  you have read, understood, and agree to be bound by these
                  terms. If you do not agree to these terms, you must
                  immediately discontinue use of the Website.
                </Text>
              </View>

              <Section
                title="1. DEFINITIONS AND INTERPRETATION"
                subsections={[
                  {
                    title: "1.1 Definitions",
                    content: (
                      <>
                        <Text style={styles.sectionText}>
                          In these Terms and Conditions, unless the context
                          otherwise requires:
                        </Text>
                        <Text></Text>
                        <Text style={styles.listItem}>
                          •{" "}
                          <Text
                            style={styles.strong}
                            className="font-urbanist-semibold"
                          >
                            "Account"
                          </Text>{" "}
                          means the user account created to access the Website;
                        </Text>

                        <Text style={styles.listItem}>
                          • <Text style={styles.strong}>"Content"</Text> means
                          all information, data, text, images, and materials on
                          the Website;
                        </Text>

                        <Text style={styles.listItem}>
                          • <Text style={styles.strong}>"Customer"</Text> or{" "}
                          <Text style={styles.listItem}>"User"</Text> means any
                          person who accesses or uses the Website;
                        </Text>

                        <Text style={styles.listItem}>
                          • <Text style={styles.strong}>"Order"</Text> means a
                          purchase request submitted through the Website;
                        </Text>

                        <Text style={styles.listItem}>
                          • <Text style={styles.strong}>"Product"</Text> means
                          any goods or services offered for sale by Vendors on
                          the Website;
                        </Text>

                        <Text style={styles.listItem}>
                          • <Text style={styles.strong}>"Services"</Text> means
                          the marketplace platform and related services provided
                          by ABX;
                        </Text>

                        <Text style={styles.listItem}>
                          • <Text style={styles.strong}>"Vendor"</Text> means
                          third-party sellers offering Products through the
                          Website;
                        </Text>

                        <Text style={styles.listItem}>
                          • <Text style={styles.strong}>"Website"</Text> means
                          the ABX Customer Website and all associated platforms;
                        </Text>
                      </>
                    ),
                  },
                ]}
              />

              <Section
                title="2. USER ACCOUNTS AND REGISTRATION"
                subsections={[
                  {
                    title: "2.1 Eligibility",
                    content: (
                      <>
                        <Text style={styles.sectionText}>
                          To register for an Account, you must:
                        </Text>
                        <ListItem text="Be at least 18 years of age;" />
                        <ListItem text="Have the legal capacity to enter into binding contracts;" />
                        <ListItem text="Provide accurate, complete, and current information during registration;" />
                        <ListItem text="Comply with all applicable laws in your jurisdiction;" />
                      </>
                    ),
                  },
                  {
                    title: "2.2 Account Creation and Management",
                    content: (
                      <>
                        <Text style={styles.sectionText}>
                          When creating an Account, you agree to:
                        </Text>
                        <ListItem text="Use only one account per email address;" />
                        <ListItem text="Provide truthful and accurate information;" />
                        <ListItem text="Keep your account information current and up-to-date;" />
                        <ListItem text="Maintain the confidentiality of your login credentials;" />
                        <ListItem text="Notify us immediately of any unauthorized access to your Account;" />
                        <ListItem text="Accept responsibility for all activities conducted under your Account;" />
                      </>
                    ),
                  },
                  {
                    title: "2.3 Account Types",
                    content: (
                      <>
                        <Text style={styles.sectionText}>
                          Customer and Vendor accounts are distinct and serve
                          different purposes. Using the same email address for
                          both account types may result in system identification
                          issues. We recommend using separate email addresses
                          for different account types to ensure proper
                          functionality.
                        </Text>
                      </>
                    ),
                  },
                  {
                    title: "2.4 Guest Browsing",
                    content: (
                      <>
                        <Text style={styles.sectionText}>
                          While you may browse Products and search the Website
                          as a guest, you must create an Account to:
                        </Text>
                        <ListItem text="Make purchases;" />
                        <ListItem text="Save favorite shops or products;" />
                        <ListItem text="Access order history;" />
                        <ListItem text="Contact customer support;" />
                        <ListItem text="Receive personalized recommendations;" />
                      </>
                    ),
                  },
                ]}
              />

              <Section
                title="3. PRIVACY AND DATA PROTECTION"
                subsections={[
                  {
                    title: "3.1 GDPR and Data Protection Compliance",
                    content: (
                      <Text style={styles.sectionText}>
                        We are committed to protecting your privacy and personal
                        data in accordance with the General Data Protection
                        Regulation (UK GDPR) and the Data Protection Act 2018.
                        By using our Website, you acknowledge and consent to our
                        data processing practices as described in our Privacy
                        Policy.
                      </Text>
                    ),
                  },
                  {
                    title: "3.2 Data Collection and Processing",
                    content: (
                      <>
                        <Text style={styles.sectionText}>
                          We collect and process the following categories of
                          personal data:
                        </Text>
                        <Text style={styles.listItem}>
                          • <Text style={styles.strong}>Identity Data:</Text>{" "}
                          Name, date of birth, username;
                        </Text>

                        <Text style={styles.listItem}>
                          • <Text style={styles.strong}>Contact Data:</Text>{" "}
                          Email address, telephone number, postal address;
                        </Text>

                        <Text style={styles.listItem}>
                          • <Text style={styles.strong}>Location Data:</Text>{" "}
                          Postcode, delivery address, GPS coordinates (with
                          consent);
                        </Text>

                        <Text style={styles.listItem}>
                          • <Text style={styles.strong}>Transaction Data:</Text>{" "}
                          Order history, payment details, purchase preferences;
                        </Text>

                        <Text style={styles.listItem}>
                          • <Text style={styles.strong}>Technical Data:</Text>{" "}
                          IP address, browser type, device information, cookies;
                        </Text>

                        <Text style={styles.listItem}>
                          • <Text style={styles.strong}>Usage Data:</Text>{" "}
                          Browsing behavior, search queries, product
                          interactions;
                        </Text>

                        <Text style={styles.listItem}>
                          • <Text style={styles.strong}>Marketing Data:</Text>{" "}
                          Communication preferences, opt-in/opt-out status;
                        </Text>
                      </>
                    ),
                  },
                  {
                    title: "3.3 Lawful Basis for Processing",
                    content: (
                      <>
                        <Text style={styles.sectionText}>
                          We process your personal data based on the following
                          lawful grounds:
                        </Text>
                        <Text style={styles.listItem}>
                          •{" "}
                          <Text style={styles.strong}>
                            Contractual Necessity:
                          </Text>{" "}
                          To perform our contract with you (order processing);
                        </Text>

                        <Text style={styles.listItem}>
                          • <Text style={styles.strong}>Legal Obligation:</Text>{" "}
                          To comply with legal and regulatory requirements;
                        </Text>

                        <Text style={styles.listItem}>
                          •{" "}
                          <Text style={styles.strong}>
                            Legitimate Interests:
                          </Text>{" "}
                          To improve our services, prevent fraud, and ensure
                          security;
                        </Text>

                        <Text style={styles.listItem}>
                          • <Text style={styles.strong}>Consent:</Text> For
                          marketing communications and optional data processing
                          (which you may withdraw at any time);
                        </Text>
                      </>
                    ),
                  },
                  {
                    title: "3.4 Your Data Protection Rights",
                    content: (
                      <>
                        <Text style={styles.sectionText}>
                          Under UK GDPR, you have the following rights:
                        </Text>
                        <Text style={styles.listItem}>
                          • <Text style={styles.strong}>Right of Access:</Text>{" "}
                          Request copies of your personal data;
                        </Text>

                        <Text style={styles.listItem}>
                          •{" "}
                          <Text style={styles.strong}>
                            Right to Rectification:
                          </Text>{" "}
                          Correct inaccurate or incomplete data (name and email
                          are editable in your profile);
                        </Text>

                        <Text style={styles.listItem}>
                          • <Text style={styles.strong}>Right to Erasure:</Text>{" "}
                          Request deletion of your Account and associated
                          personal data;
                        </Text>

                        <Text style={styles.listItem}>
                          •{" "}
                          <Text style={styles.strong}>
                            Right to Restrict Processing:
                          </Text>{" "}
                          Request limitation of how we use your data;
                        </Text>

                        <Text style={styles.listItem}>
                          •{" "}
                          <Text style={styles.strong}>
                            Right to Data Portability:
                          </Text>{" "}
                          Receive your data in a structured, machine-readable
                          format;
                        </Text>

                        <Text style={styles.listItem}>
                          • <Text style={styles.strong}>Right to Object:</Text>{" "}
                          Object to processing based on legitimate interests or
                          direct marketing;
                        </Text>

                        <Text style={styles.listItem}>
                          •{" "}
                          <Text style={styles.strong}>
                            Rights Related to Automated Decision-Making:
                          </Text>{" "}
                          Not be subject to decisions based solely on automated
                          processing;
                        </Text>
                        <ListItem text="Right to Object: Object to processing based on legitimate interests;" />
                        <Text style={styles.footnote}>
                          To exercise any of these rights, please contact our
                          Data Protection Officer at dpo@abx.com
                        </Text>
                      </>
                    ),
                  },
                  {
                    title: "3.5 Data Retention",
                    content: (
                      <Text style={styles.sectionText}>
                        We retain your personal data only for as long as
                        necessary to fulfil the purposes for which it was
                        collected, including legal, accounting, or reporting
                        requirements. Transaction records are retained for seven
                        years in accordance with HMRC requirements.
                      </Text>
                    ),
                  },
                  {
                    title: "3.6 Data Security",
                    content: (
                      <Text style={styles.sectionText}>
                        We implement appropriate technical and organizational
                        measures to protect your personal data against
                        unauthorized access, loss, destruction, or alteration.
                        However, no internet transmission is completely secure,
                        and we cannot guarantee absolute security.
                      </Text>
                    ),
                  },
                  {
                    title: "3.7 Cookie Policy",
                    content: (
                      <Text style={styles.sectionText}>
                        We use cookies and similar tracking technologies to
                        enhance your user experience, analyze Website usage, and
                        deliver personalized content. By using our Website, you
                        consent to our use of cookies in accordance with our
                        Cookie Policy. You may manage your cookie preferences
                        through your browser settings, though some Website
                        features may not function properly if cookies are
                        disabled.
                      </Text>
                    ),
                  },
                  {
                    title: "33.8 Third-Party Data Sharing",
                    content: (
                      <>
                        <Text style={styles.sectionText}>
                          We may share your personal data with:
                        </Text>
                        <ListItem text="Vendors to fulfil your Orders;" />
                        <ListItem text="Payment processors to process transactions;" />
                        <ListItem text="Delivery partners to deliver your Orders;" />
                        <ListItem text="Service providers who assist in operating the Website;" />
                        <ListItem text='Law enforcement or regulatory authorities": when legally required;' />
                        <Text style={styles.sectionText}>
                          We do not sell your personal data to third parties for
                          marketing purposes.
                        </Text>
                      </>
                    ),
                  },
                ]}
              />
              <Section
                title="4. WEBSITE USAGE AND SERVICES"
                subsections={[
                  {
                    title: "4.1 Product Search and Discovery",
                    content: (
                      <>
                        <Text style={styles.sectionText}>
                          The Website provides search and discovery features
                          including:
                        </Text>
                        <ListItem text="Location-based search prioritizing products and shops based on your postcode;" />
                        <ListItem text="Category browsing and filtering;" />
                        <ListItem text="Featured products and promotional sections;" />
                        <ListItem text="Rescue & Save section featuring discounted items;" />
                        <ListItem text="New and popular product highlights;" />
                        <Text style={styles.sectionText}>
                          Search functionality is optimized for mobile devices
                          with horizontal scrolling features. Product
                          availability, pricing, and information are subject to
                          change without notice.
                        </Text>
                      </>
                    ),
                  },
                  {
                    title: "4.2 Shopping Cart and Checkout",
                    content: (
                      <>
                        <Text style={styles.sectionText}>
                          The shopping cart functionality allows you to:
                        </Text>
                        <ListItem text="Add Products to your cart for later purchase;" />
                        <ListItem text="View real-time item counts and total pricing;" />
                        <ListItem text="Modify quantities or remove items;" />

                        <Text style={styles.sectionText}>
                          To complete a purchase, you must:
                        </Text>
                        <ListItem text="Register for an Account or log in to an existing Account;" />
                        <ListItem text="Provide accurate delivery information;" />
                        <ListItem text="Select a valid payment method;" />
                        <ListItem text="Agree to these Terms and Conditions;" />
                      </>
                    ),
                  },
                  {
                    title: "4.3 Orders and Purchases",
                    content: (
                      <>
                        <Text style={styles.sectionText}>
                          When you place an Order:
                        </Text>
                        <ListItem text="You are making an offer to purchase Products from the Vendor;" />
                        <ListItem text="The contract is formed when the Vendor accepts your Order;" />
                        <ListItem text="You will receive order confirmation via email;" />
                        <ListItem text="You agree to pay the total amount including all applicable charges;" />
                        <ListItem text="Orders are subject to acceptance by the Vendor;" />
                        <ListItem text="We reserve the right to refuse or cancel Orders in cases of suspected fraud, pricing errors, or Product unavailability;" />
                      </>
                    ),
                  },
                  {
                    title: "4.4 Pricing and Payment",
                    content: (
                      <>
                        <Text style={styles.sectionText}>
                          All prices displayed on the Website:
                        </Text>
                        <ListItem text="Are in British Pounds Sterling (GBP) unless otherwise stated;" />
                        <ListItem text="Include VAT where applicable;" />
                        <ListItem text="May change without notice;" />
                        <ListItem text="Are set by individual Vendors;" />
                        <Text style={styles.sectionText}>
                          Payments are processed securely through our authorized
                          payment service providers. We do not store your
                          complete payment card details. You authorize us to
                          charge the payment method provided for all Orders
                          placed.
                        </Text>
                      </>
                    ),
                  },
                  {
                    title: "4.5 Favorites and Personalization",
                    content: (
                      <>
                        <Text style={styles.sectionText}>
                          Registered users can:
                        </Text>
                        <ListItem text="Save favorite shops and products for quick access;" />
                        <ListItem text="Receive personalized recommendations based on browsing behavior and purchase history; " />
                        <ListItem text="Access previously viewed items;" />
                      </>
                    ),
                  },
                  {
                    title: "4.6 Product Information and Descriptions",
                    content: (
                      <>
                        <Text style={styles.sectionText}>
                          While we make reasonable efforts to ensure Product
                          information is accurate, we do not warrant the
                          completeness or accuracy of all Product descriptions,
                          images, prices, or availability. Vendors are
                          responsible for the accuracy of their Product
                          listings. If you receive a Product that does not match
                          its description, please contact customer support.
                        </Text>
                      </>
                    ),
                  },
                ]}
              />

              <Section
                title="5. DELIVERY AND FULFILMENT"
                subsections={[
                  {
                    title: "Delivery",
                    content: (
                      <>
                        <Text style={styles.sectionText}>
                          Delivery services are provided by Vendors or ABX
                          delivery partners. Delivery times are estimates and
                          not guaranteed. You must:
                        </Text>
                        <ListItem text="Provide accurate delivery information;" />
                        <ListItem text="Ensure someone is available to receive the delivery;" />
                        <ListItem text="Inspect Products upon delivery;" />
                        <ListItem text="Report any issues immediately;" />
                      </>
                    ),
                  },
                  {
                    title: "5.2 Delivery Charges",
                    content: (
                      <>
                        <Text style={styles.sectionText}>
                          Delivery charges, if applicable, will be clearly
                          displayed at checkout and are based on factors
                          including distance, order value, and delivery time
                          preferences.
                        </Text>
                      </>
                    ),
                  },
                  {
                    title: "5.3 Failed Deliveries",
                    content: (
                      <>
                        <Text style={styles.sectionText}>
                          If delivery cannot be completed due to incorrect
                          address information, unavailability to receive the
                          Order, or refusal to accept delivery, you may be
                          charged additional fees for redelivery attempts.
                        </Text>
                      </>
                    ),
                  },
                ]}
              />

              <Section
                title="6. RETURNS, REFUNDS, AND CANCELLATIONS"
                subsections={[
                  {
                    title: "Consumer Rights",
                    content: (
                      <>
                        <Text style={styles.sectionText}>
                          You have statutory rights under the Consumer Rights
                          Act 2015 and the Consumer Contracts (Information,
                          Cancellation and Additional Charges) Regulations 2013.
                          These rights include:
                        </Text>
                        <ListItem text="Right to cancel within 14 days of receiving the Products (subject to exceptions);" />
                        <ListItem text="Right to reject faulty goods and receive a refund or replacement;" />
                        <ListItem text="Right to Products that are as described, of satisfactory quality, and fit for purpose;" />
                      </>
                    ),
                  },
                  {
                    title: "6.2 Cancellation Rights",
                    content: (
                      <Text style={styles.sectionText}>
                        You may cancel an Order before it is accepted by the
                        Vendor without charge. Once the Vendor has accepted and
                        begun preparing your Order, cancellation may not be
                        possible. Perishable food items and certain other
                        Products may be exempt from cancellation rights under
                        consumer protection legislation.
                      </Text>
                    ),
                  },
                  {
                    title: "6.3 Returns Process",
                    content: (
                      <>
                        <Text style={styles.sectionText}>
                          To initiate a return:
                        </Text>
                        <ListItem text="Contact customer support with your Order number;" />
                        <ListItem text="Provide details of the issue;" />
                        <ListItem text="Follow the return instructions provided;" />
                        <ListItem text="Return Products in their original condition where possible;" />
                      </>
                    ),
                  },
                  {
                    title: "6.4 Refunds",
                    content: (
                      <>
                        <Text style={styles.sectionText}>
                          Approved refunds will be processed within 14 days of
                          receiving the returned Products or your cancellation
                          notice. Refunds will be issued to the original payment
                          method unless otherwise agreed.
                        </Text>
                      </>
                    ),
                  },
                ]}
              />

              <Section
                title="7. USER CONDUCT AND ACCEPTABLE USE"
                subsections={[
                  {
                    title: "7.1 Prohibited Activities",
                    content: (
                      <>
                        <Text style={styles.sectionText}>
                          You agree not to:
                        </Text>
                        <ListItem text="Create multiple accounts with the same email address;" />
                        <ListItem text="Use another person's Account without permission;" />
                        <ListItem text="Attempt to circumvent authentication or security systems;" />
                        <ListItem text="Use the Website for any illegal, fraudulent, or unauthorized purpose;" />
                        <ListItem text="Interfere with or disrupt the Website's functionality or servers;" />
                        <ListItem text="Engage in any activity that could harm, disable, or impair the Website;" />
                        <ListItem text="Collect or harvest personal information of other users;" />
                        <ListItem text="Use automated systems (bots, scrapers) to access the Website;" />
                        <ListItem text="Transmit viruses, malware, or other harmful code;" />
                        <ListItem text="Impersonate any person or entity;" />
                        <ListItem text="Post false, misleading, or defamatory content;" />
                      </>
                    ),
                  },
                  {
                    title: "7.2 Content Guidelines",
                    content: (
                      <>
                        <Text style={styles.sectionText}>
                          Any content you submit (reviews, comments, messages)
                          must:
                        </Text>
                        <ListItem text="Be accurate and truthful;" />
                        <ListItem text="Not infringe on third-party intellectual property or privacy rights;" />
                        <ListItem text="Not contain offensive, defamatory, obscene, or harmful material;" />
                        <ListItem text="Not promote illegal activities or products;" />
                        <ListItem text="Comply with all applicable laws;" />
                        <Text style={styles.sectionText}>
                          We reserve the right to remove any content that
                          violates these guidelines and to suspend or terminate
                          accounts of users who repeatedly violate these terms;
                        </Text>
                      </>
                    ),
                  },
                ]}
              />

              <Section
                title="8. CUSTOMER SUPPORT"
                subsections={[
                  {
                    title: "8.1 Support Services",
                    content: (
                      <>
                        <Text style={styles.sectionText}>
                          Customer support is available to registered users
                          through multiple channels including live chat, email,
                          and phone. Support services include:
                        </Text>
                        <ListItem text="Order assistance and tracking;" />
                        <ListItem text="Technical support;" />
                        <ListItem text="Account management help;" />
                        <ListItem text="Product inquiries;" />
                        <ListItem text="Complaint resolution;" />
                      </>
                    ),
                  },
                  {
                    title: "8.2 Support Process",
                    content: (
                      <>
                        <Text style={styles.sectionText}>
                          Support sessions are customer-initiated and may be
                          concluded by administrators once issues are resolved.
                          When contacting support, please:
                        </Text>
                        <ListItem text="Provide accurate account information;" />
                        <ListItem text="Clearly describe your issue or inquiry;" />
                        <ListItem text="Include relevant Order numbers or screenshots;" />
                        <ListItem text="Cooperate with support staff during troubleshooting;" />
                        <ListItem text="Follow established support procedures;" />
                      </>
                    ),
                  },
                  {
                    title: "8.3 Response Times",
                    content: (
                      <>
                        <Text style={styles.sectionText}>
                          While we strive to respond promptly, response times
                          may vary based on inquiry volume and complexity. We
                          aim to respond to all inquiries within 24-48 hours
                          during business days.
                        </Text>
                      </>
                    ),
                  },
                ]}
              />

              <Section
                title="9. INTELLECTUAL PROPERTY RIGHTS"
                subsections={[
                  {
                    title: "9.1 ABX Intellectual Property",
                    content: (
                      <>
                        <Text style={styles.sectionText}>
                          All Content on the Website, including but not limited
                          to:
                        </Text>
                        <ListItem text="Text, graphics, logos, images, and photographs;" />
                        <ListItem text="Software, source code, and underlying technology;" />
                        <ListItem text="Product descriptions and catalog information;" />
                        <ListItem text="Website design, layout, and user interface;" />
                        <ListItem text="Trademarks, service marks, and brand names;" />
                        <Text style={styles.sectionText}>
                          are the property of ABX, our Vendors, or our licensors
                          and are protected by copyright, trademark, and other
                          intellectual property laws of the United Kingdom and
                          international treaties;
                        </Text>
                      </>
                    ),
                  },
                  {
                    title: "9.2 Limited License",
                    content: (
                      <>
                        <Text style={styles.sectionText}>
                          Subject to these Terms, we grant you a limited,
                          non-exclusive, non-transferable, revocable license to
                          access and use the Website for personal,
                          non-commercial purposes. This license does not permit
                          you to:
                        </Text>
                        <ListItem text="Reproduce, distribute, or publicly display any Content;" />
                        <ListItem text="Modify, adapt, or create derivative works;" />
                        <ListItem text="Decompile, reverse engineer, or disassemble any software;" />
                        <ListItem text="Remove any copyright, trademark, or proprietary notices;" />
                        <ListItem text="Use Content for commercial purposes without authorization;" />
                      </>
                    ),
                  },
                  {
                    title: "9.3 User-Generated Content",
                    content: (
                      <>
                        <Text style={styles.sectionText}>
                          By submitting content to the Website (reviews,
                          comments, feedback), you grant ABX a worldwide, non-
                          exclusive, royalty-free, perpetual license to use,
                          reproduce, modify, publish, and distribute such
                          content for business purposes
                        </Text>
                      </>
                    ),
                  },
                ]}
              />

              <Section
                title="10. DISCLAIMERS AND LIMITATION OF LIABILITY"
                subsections={[
                  {
                    title: "10.1 Service Availability",
                    content: (
                      <>
                        <Text style={styles.sectionText}>
                          While we strive to maintain continuous service
                          availability and ensure the Website functions
                          properly, we do not guarantee uninterrupted, timely,
                          secure, or error-free access. We reserve the right to
                          suspend or restrict access to the Website for:
                        </Text>
                        <ListItem text="Scheduled or emergency maintenance;" />
                        <ListItem text="System upgrades or updates;" />
                        <ListItem text="Security reasons;" />
                        <ListItem text="Technical difficulties;" />
                        <ListItem text="Force majeure events;" />
                      </>
                    ),
                  },
                  {
                    title: "10.2 Product and Content Accuracy",
                    content: (
                      <Text style={styles.sectionText}>
                        We make reasonable efforts to ensure Product
                        information, pricing, and availability are accurate.
                        However, we do not warrant the completeness, accuracy,
                        or reliability of any Content on the Website. Vendors
                        are responsible for their Product listings, and we are
                        not liable for errors or omissions in Vendor-provided
                        information.
                      </Text>
                    ),
                  },
                  {
                    title: "10.3 Third-Party Products and Services",
                    content: (
                      <>
                        <Text style={styles.sectionText}>
                          ABX acts as a marketplace platform connecting
                          Customers with independent Vendors. We are not
                          responsible for:
                        </Text>
                        <ListItem text="The quality, safety, or legality of Products sold by Vendors;" />
                        <ListItem text="The accuracy of Product descriptions provided by Vendors;" />
                        <ListItem text="Vendor's ability to complete transactions;" />
                        <ListItem text="Disputes between Customers and Vendors;" />
                        <Text style={styles.sectionText}>
                          However, we will assist in facilitating resolution of
                          disputes and may take action against Vendors who
                          violate our policies.
                        </Text>
                      </>
                    ),
                  },
                  {
                    title: "10.4 Disclaimer of Warranties",
                    content: (
                      <Text style={styles.sectionText}>
                        To the fullest extent permitted by law, the Website and
                        all Content are provided "as is" and "as available"
                        without warranties of any kind, either express or
                        implied, including but not limited to warranties of
                        merchantability, fitness for a particular purpose, or
                        non-infringement.
                      </Text>
                    ),
                  },
                  {
                    title: "10.5 Limitation of Liability",
                    content: (
                      <>
                        <Text style={styles.sectionText}>
                          To the maximum extent permitted by law, ABX shall not
                          be liable for any:
                        </Text>
                        <ListItem text="Indirect, incidental, special, consequential, or punitive damages;" />
                        <ListItem text="Loss of profits, revenue, data, or business opportunities;" />
                        <ListItem text="Service interruptions or system failures;" />
                        <ListItem text="Unauthorized access to or alteration of your data;" />
                        <ListItem text="Statements or conduct of any third party on the Website;" />
                        <Text style={styles.sectionText}>
                          Our total aggregate liability to you for all claims
                          arising from or relating to these Terms or your use of
                          the Website shall not exceed the total amount paid by
                          you to ABX in the twelve (12) months preceding the
                          claim, or £100, whichever is greater.
                        </Text>
                      </>
                    ),
                  },
                  {
                    title: "10.6 Statutory Rights",
                    content: (
                      <>
                        <Text style={styles.sectionText}>
                          Nothing in these Terms excludes or limits our
                          liability for:
                        </Text>
                        <ListItem text="Death or personal injury caused by our negligence;" />
                        <ListItem text="Fraud or fraudulent misrepresentation;" />
                        <ListItem text="Any liability that cannot be excluded or limited by English law;" />
                        <Text style={styles.sectionText}>
                          These Terms do not affect your statutory rights as a
                          consumer under UK law.
                        </Text>
                      </>
                    ),
                  },
                ]}
              />

              <Section
                title="11. ACCOUNT TERMINATION AND SUSPENSION"
                subsections={[
                  {
                    title: "11.1 Termination by User",
                    content: (
                      <>
                        <Text style={styles.sectionText}>
                          You may terminate your Account at any time by:
                        </Text>
                        <ListItem text="Using the account deletion feature in your profile settings;" />
                        <ListItem text="Contacting customer support with a deletion request;" />
                        <Text style={styles.sectionText}>
                          Upon termination, your personal data will be deleted
                          in accordance with our data retention policies and
                          legal obligations. You remain responsible for
                          completing any outstanding Orders and paying any
                          amounts owed.
                        </Text>
                      </>
                    ),
                  },
                  {
                    title: "11.2 Suspension or Termination by ABX",
                    content: (
                      <>
                        <Text style={styles.sectionText}>
                          We reserve the right to suspend or terminate your
                          Account immediately without prior notice for:
                        </Text>
                        <ListItem text="Violation of these Terms and Conditions;" />
                        <ListItem text="Fraudulent, suspicious, or illegal activity;" />
                        <ListItem text="Abusive behavior toward other users or staff;" />
                        <ListItem text="Multiple complaints from Vendors;" />
                        <ListItem text="Extended periods of inactivity (12+ months);" />
                        <ListItem text="Failure to pay amounts owed;" />
                        <ListItem text="Any conduct that we deem harmful to the Website or other users;" />
                      </>
                    ),
                  },
                  {
                    title: "11.3 Effects of Termination",
                    content: (
                      <>
                        <Text style={styles.sectionText}>
                          Upon termination of your Account:
                        </Text>
                        <ListItem text="Your access to the Website will be revoked;" />
                        <ListItem text="Your personal data will be deleted or anonymized (subject to legal retention requirements);" />
                        <ListItem text="Saved favorites and preferences will be removed;" />
                        <ListItem text="Order history will be retained for legal and accounting purposes;" />
                        <ListItem text="Outstanding Orders must be completed or cancelled;" />
                      </>
                    ),
                  },
                ]}
              />

              <Section
                title="12. MODIFICATIONS TO TERMS AND SERVICES"
                subsections={[
                  {
                    title: "12.1 Changes to Terms",
                    content: (
                      <>
                        <Text style={styles.sectionText}>
                          We reserve the right to modify, amend, or update these
                          Terms and Conditions at any time. When we make
                          material changes, we will:
                        </Text>
                        <ListItem text="Update the 'Last Updated' date at the top of this document;" />
                        <ListItem text="Notify you via email to your registered email address;" />
                        <ListItem text="Display a prominent notice on the Website;" />
                        <ListItem text="Provide at least 30 days' notice before changes take effect (for material changes);" />
                        <Text style={styles.sectionText}>
                          Your continued use of the Website after changes take
                          effect constitutes acceptance of the modified Terms.
                          If you do not agree to the changes, you must
                          discontinue use of the Website and may terminate your
                          Account.
                        </Text>
                      </>
                    ),
                  },
                  {
                    title: "12.2 Service Modifications",
                    content: (
                      <>
                        <Text style={styles.sectionText}>
                          We reserve the right to modify, suspend, or
                          discontinue any aspect of the Website or Services at
                          any time, with or without notice, including:
                        </Text>
                        <ListItem text="Features and functionality;" />
                        <ListItem text="Product availability;" />
                        <ListItem text="Pricing structures;" />
                        <ListItem text="Service areas and delivery options;" />
                      </>
                    ),
                  },
                ]}
              />

              <Section
                title="13. GOVERNING LAW AND DISPUTE RESOLUTION"
                subsections={[
                  {
                    title: "13.1 Governing Law",
                    content: (
                      <>
                        <Text style={styles.sectionText}>
                          These Terms and Conditions shall be governed by and
                          construed in accordance with the laws of England and
                          Wales, without regard to conflict of law principles.
                        </Text>
                      </>
                    ),
                  },
                  {
                    title: "13.2 Jurisdiction",
                    content: (
                      <>
                        <Text style={styles.sectionText}>
                          Subject to Section 13.4 below, the courts of England
                          and Wales shall have exclusive jurisdiction to settle
                          any dispute or claim arising out of or in connection
                          with these Terms or your use of the Website.
                        </Text>
                      </>
                    ),
                  },
                  {
                    title: "13.3 Dispute Resolution Process",
                    content: (
                      <>
                        <Text style={styles.sectionText}>
                          If you have a dispute with us, we encourage you to
                          first contact our customer support team to attempt
                          informal resolution. We are committed to resolving
                          disputes amicably and in good faith. If informal
                          resolution is unsuccessful, we both agree to attempt
                          resolution through:
                        </Text>
                        <Text style={styles.listItem}>
                          • <Text style={styles.strong}>Negotiation:</Text>{" "}
                          Direct discussions between the parties;
                        </Text>
                        <Text style={styles.listItem}>
                          • <Text style={styles.strong}>Mediation:</Text>{" "}
                          Assistance from a neutral third-party mediator;
                        </Text>
                        <Text style={styles.listItem}>
                          • <Text style={styles.strong}>Arbitration:</Text>{" "}
                          Binding arbitration as an alternative to court
                          proceedings (optional);
                        </Text>
                      </>
                    ),
                  },
                  {
                    title: "13.4 Consumer Rights",
                    content: (
                      <>
                        <Text style={styles.sectionText}>
                          If you are a consumer residing in the European Union,
                          you may also have the right to bring proceedings in
                          the courts of your country of residence. Nothing in
                          these Terms affects your statutory rights as a
                          consumer.
                        </Text>
                      </>
                    ),
                  },
                  {
                    title: "13.5 Online Dispute Resolution",
                    content: (
                      <>
                        <Text style={styles.sectionText}>
                          The European Commission provides an Online Dispute
                          Resolution (ODR) platform for consumers to resolve
                          disputes. You may access the ODR platform at:
                          http://ec.europa.eu/consumers/odr/
                        </Text>
                      </>
                    ),
                  },
                ]}
              />

              <Section
                title="14. GENERAL PROVISIONS"
                subsections={[
                  {
                    title: "14.1 Entire Agreement",
                    content: (
                      <>
                        <Text style={styles.sectionText}>
                          These Terms and Conditions, together with our Privacy
                          Policy, Cookie Policy, and any other policies
                          referenced herein, constitute the entire agreement
                          between you and ABX regarding your use of the Website
                          and supersede all prior or contemporaneous
                          communications, agreements, or understandings, whether
                          oral or written.
                        </Text>
                      </>
                    ),
                  },
                  {
                    title: "14.2 Severability",
                    content: (
                      <>
                        <Text style={styles.sectionText}>
                          If any provision of these Terms is found to be
                          invalid, illegal, or unenforceable by a court of
                          competent jurisdiction, such provision shall be
                          modified to the minimum extent necessary to make it
                          valid and enforceable, or if such modification is not
                          possible, it shall be severed from these Terms. The
                          remaining provisions shall remain in full force and
                          effect.
                        </Text>
                      </>
                    ),
                  },
                  {
                    title: "14.3 Waiver",
                    content: (
                      <>
                        <Text style={styles.sectionText}>
                          Our failure to enforce any right or provision of these
                          Terms shall not constitute a waiver of such right or
                          provision. No waiver of any breach of these Terms
                          shall be deemed a waiver of any subsequent breach.
                        </Text>
                      </>
                    ),
                  },
                  {
                    title: "14.4 Assignment",
                    content: (
                      <>
                        <Text style={styles.sectionText}>
                          You may not assign, transfer, or delegate your rights
                          or obligations under these Terms without our prior
                          written consent. We may assign our rights and
                          obligations to any affiliated company, successor, or
                          assignee without restriction or notification.
                        </Text>
                      </>
                    ),
                  },
                  {
                    title: "14.5 No Agency Relationship",
                    content: (
                      <>
                        <Text style={styles.sectionText}>
                          Nothing in these Terms creates a partnership, joint
                          venture, employment, franchise, or agency relationship
                          between you and ABX. You have no authority to bind ABX
                          or make commitments on our behalf.
                        </Text>
                      </>
                    ),
                  },
                  {
                    title: "14.6 Force Majeure",
                    content: (
                      <>
                        <Text style={styles.sectionText}>
                          Neither party shall be liable for any failure or delay
                          in performance due to circumstances beyond their
                          reasonable control, including but not limited to:
                        </Text>
                        <ListItem text="Acts of God, natural disasters, pandemics, or epidemics;" />
                        <ListItem text="War, terrorism, civil unrest, or government actions;" />
                        <ListItem text="Strikes, labor disputes, or supply chain disruptions;" />
                        <ListItem text="Telecommunications or internet failures;" />
                        <ListItem text="Power outages or equipment failures;" />
                      </>
                    ),
                  },
                  {
                    title: "14.7 Notices",
                    content: (
                      <>
                        <Text style={styles.sectionText}>
                          All notices, requests, and communications under these
                          Terms must be in writing and sent to:
                        </Text>
                        <ListItem text="To ABX: Via the customer support system or to legal@abx.com;" />
                        <ListItem text="To You: Via the email address associated with your Account;" />
                        <Text style={styles.sectionText}>
                          Notices are deemed received: (i) if by email, on the
                          next business day after sending; (ii) if by post, five
                          business days after mailing
                        </Text>
                      </>
                    ),
                  },
                  {
                    title: "14.8 Third-Party Rights",
                    content: (
                      <>
                        <Text style={styles.sectionText}>
                          These Terms do not confer any rights or benefits on
                          third parties under the Contracts (Rights of Third
                          Parties) Act 1999, except as expressly stated.
                        </Text>
                      </>
                    ),
                  },
                  {
                    title: "14.9 Headings",
                    content: (
                      <>
                        <Text style={styles.sectionText}>
                          The section headings in these Terms are for
                          convenience only and have no legal or contractual
                          effect.
                        </Text>
                      </>
                    ),
                  },
                  {
                    title: "14.10 Language",
                    content: (
                      <>
                        <Text style={styles.sectionText}>
                          These Terms are provided in English. In the event of
                          any conflict between an English version and a
                          translated version, the English version shall prevail.
                        </Text>
                      </>
                    ),
                  },
                ]}
              />

              <Section
                title="15. CONTACT INFORMATION"
                content={
                  <>
                    <Text style={styles.contactLabel}>Company Name:</Text>
                    <Text style={styles.sectionText}>
                      Afrobasket Express Technology Limited
                    </Text>

                    <Text
                      style={[styles.contactLabel, styles.contactMarginTop]}
                    >
                      General Inquiries:
                    </Text>
                    <Text style={styles.sectionText}>
                      info@abxtechnologies.co.uk
                    </Text>

                    <Text
                      style={[styles.contactLabel, styles.contactMarginTop]}
                    >
                      Customer Support:
                    </Text>
                    <Text style={styles.sectionText}>support@abx.com</Text>

                    <Text
                      style={[styles.contactLabel, styles.contactMarginTop]}
                    >
                      Data Protection Officer:
                    </Text>
                    <Text style={styles.sectionText}>dpo@abx.com</Text>

                    <Text
                      style={[styles.contactLabel, styles.contactMarginTop]}
                    >
                      Legal Department:
                    </Text>
                    <Text style={styles.sectionText}>legal@abx.com</Text>
                    <Text
                      style={[styles.contactLabel, styles.contactMarginTop]}
                    >
                      Customer Support Chat
                    </Text>
                    <Text style={styles.sectionText}>
                      Available through the Website
                    </Text>

                    <Text
                      style={[styles.contactLabel, styles.contactMarginTop]}
                    >
                      Contact No.:
                    </Text>
                    <Text style={styles.sectionText} onPress={handleCallPress}>
                      07478687182
                    </Text>
                  </>
                }
              />

              <View style={styles.acknowledgement}>
                <Text style={styles.acknowledgementTitle}>
                  ACKNOWLEDGEMENT AND ACCEPTANCE:
                </Text>
                <Text style={styles.acknowledgementText}>
                  By registering for an Account or using the ABX Customer
                  Website, you acknowledge that you have read, understood, and
                  agree to be bound by these Terms and Conditions. You confirm
                  that you are at least 18 years of age and have the legal
                  capacity to enter into this agreement.
                </Text>
              </View>

              <View style={styles.consumerNotice}>
                <Text style={styles.consumerTitle}>
                  CONSUMER RIGHTS NOTICE:
                </Text>
                <Text style={styles.consumerText}>
                  These Terms do not affect your statutory rights as a consumer
                  under UK law, including rights under the Consumer Rights Act
                  2015, the Consumer Contracts Regulations 2013, and UK GDPR.
                </Text>
              </View>

              <View style={styles.footer}>
                <Text style={styles.footerText}>
                  Version 1.0 | Effective Date: November 10, 2025 | Last
                  Updated: November 10, 2025
                </Text>
                <Text style={styles.footerText}>
                  Governed by the Laws of England and Wales
                </Text>
                <Text style={styles.footerText}>
                  © 2025 Afrobasket Express Technology Limited. All rights
                  reserved.
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

const Section = ({ title, subsections, content }: any) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {content}
    {subsections?.map((sub: any, idx: number) => (
      <View key={idx} style={styles.subsection}>
        <Text style={styles.subsectionTitle}>{sub.title}</Text>
        {sub.content}
      </View>
    ))}
  </View>
);

const ListItem = ({ text }: any) => (
  <Text style={styles.listItem}>• {text}</Text>
);

const styles = StyleSheet.create({
  container: {},
  scrollView: {},
  scrollContent: {
    paddingBottom: 48,
  },
  paddingH: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  breadcrumb: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  breadcrumbButton: {
    padding: 4,
  },
  chevron: {
    marginHorizontal: 4,
  },
  breadcrumbText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#0C513F",
    fontFamily: "UrbanistMedium",
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 24,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#2D2220",
    marginBottom: 8,
    fontFamily: "UrbanistSemiBold",
  },
  effectiveDate: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 4,
    fontFamily: "UrbanistRegular",
  },
  lastUpdated: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 24,
    fontFamily: "UrbanistRegular",
  },
  importantNotice: {
    marginBottom: 24,
  },
  noticeText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#2D2220",
    lineHeight: 20,
    fontFamily: "UrbanistSemiBold",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0C513F",
    marginBottom: 12,
    marginTop: 8,
    fontFamily: "UrbanistSemiBold",
  },
  subsection: {
    marginBottom: 12,
    marginTop: 12,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2D2220",
    marginBottom: 8,
    fontFamily: "UrbanistSemiBold",
  },
  sectionText: {
    fontSize: 13,
    color: "#4B5563",
    lineHeight: 20,
    fontFamily: "UrbanistRegular",
    marginBottom: 8,
  },
  listItem: {
    fontSize: 13,
    color: "#4B5563",
    lineHeight: 20,
    marginLeft: 8,
    marginBottom: 6,
    fontFamily: "UrbanistRegular",
  },
  strong: {
    fontSize: 13,
    color: "#4B5563",
    lineHeight: 20,
    marginLeft: 8,
    marginBottom: 6,
    fontFamily: "UrbanistSemiBold",
  },
  footnote: {
    fontSize: 12,
    color: "#666666",
    marginTop: 12,
    fontFamily: "UrbanistRegular",
  },
  contactLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#2D2220",
    fontFamily: "UrbanistSemiBold",
  },
  contactMarginTop: {
    marginTop: 12,
  },
  acknowledgement: {
    backgroundColor: "#FDF0DC",
    borderLeftWidth: 5,
    borderColor: "#F4B551",
    borderRadius: 8,
    padding: 16,
    marginTop: 32,
    marginBottom: 12,
  },
  acknowledgementTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#991B1B",
    marginBottom: 8,
    fontFamily: "UrbanistBold",
  },
  acknowledgementText: {
    fontSize: 12,
    color: "#424242",
    lineHeight: 18,
    fontFamily: "UrbanistRegular",
  },
  consumerNotice: {
    backgroundColor: "#ECF1F0",
    borderLeftWidth: 5,
    borderColor: "#346E5F",
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  consumerTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#346E5F",
    marginBottom: 8,
    fontFamily: "UrbanistBold",
  },
  consumerText: {
    fontSize: 12,
    color: "#424242",
    lineHeight: 18,
    fontFamily: "UrbanistRegular",
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: 16,
    alignItems: "center",
  },
  footerText: {
    fontSize: 11,
    color: "#6B7280",
    textAlign: "center",
    marginVertical: 4,
  },
});

export default TermsAndConditionsScreen;
