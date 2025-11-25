import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import ScreenWrapper from "@/common/ScreenWrapper";
import Header from "@/common/Header";
import { router } from "expo-router";
import DotBox from "@/common/DotBox";
import CancelModalIcon from "@/assets/svgs//CancelModalIcon.svg";
import UrbanistText from "@/common/UrbanistText";

const PrivacyPolicyScreen = () => {
  return (
    <ScreenWrapper>
      <Header title="Our privacy policy" />

      <View>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.card}>
            <View className="flex-row items-start justify-between ">
              <View>
                <Text style={styles.title}>Privacy Policy</Text>
                <Text style={styles.subtitle}>
                  AFROBASKET EXPRESS TECHNOLOGY LIMITED
                </Text>
              </View>

              <Pressable className=" items-end " onPress={() => router.back()}>
                <CancelModalIcon />
              </Pressable>
            </View>

            <View style={styles.metaBox} className="mt-2">
              <Text style={styles.metaText}>
                Effective Date: November 10, 2025
              </Text>
              <Text style={styles.metaText}>
                Last Updated: November 10, 2025
              </Text>
              <Text style={styles.metaText}>Policy Version: 1.0</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.h3}> YOUR PRIVACY MATTERS:</Text>
              <Text style={styles.paragraph}>
                Afrobasket Express Technology Limited ("ABX", "we", "us", or
                "our") is committed to protecting your privacy and personal
                data. This Privacy Policy explains how we collect, use, store,
                and protect your personal information when you use our platforms
                (Customer Website, Vendor Website, Vendor App, Customer App, and
                Admin Portal - collectively, the "Services"). This policy
                complies with the UK General Data Protection Regulation (UK
                GDPR) and the Data Protection Act 2018.
              </Text>

              <Text style={styles.h2}>1. DATA CONTROLLER INFORMATION</Text>
              <View style={styles.infoBox}>
                <Text style={styles.paragraph}>
                  <Text style={styles.bold}>Data Controller:</Text> Afrobasket
                  Express Technology Limited
                </Text>
                <Text style={styles.paragraph}>
                  <Text style={styles.bold}>Registered Office:</Text> 16
                  newcroft drive glasgow
                </Text>
                <Text style={styles.paragraph}>
                  <Text style={styles.bold}>Company Registration Number:</Text>{" "}
                  g445rs
                </Text>
                <Text style={styles.paragraph}>
                  <Text style={styles.bold}>Privacy Inquiries:</Text>{" "}
                  info@abxtechnologies.co.uk
                </Text>
              </View>
              <Text style={styles.paragraph}>
                As the data controller, we are responsible for determining how
                and why your personal data is processed. We take this
                responsibility seriously and are committed to transparency in
                our data practices.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.h2}>2. SCOPE AND APPLICATION</Text>

              <Text style={styles.h3}>2.1 Who This Policy Applies To</Text>
              <Text style={styles.paragraph}>
                This Privacy Policy applies to:
              </Text>
              <Text style={styles.listItem}>
                <Text style={styles.bold}>Customers:</Text> Individuals using
                our customer-facing platforms to browse and purchase products;
              </Text>
              <Text style={styles.listItem}>
                <Text style={styles.bold}>Vendors:</Text> Business users selling
                products through our marketplace;
              </Text>
              <Text style={styles.listItem}>
                <Text style={styles.bold}>Delivery Agents:</Text> Independent
                contractors providing delivery services;
              </Text>
              <Text style={styles.listItem}>
                <Text style={styles.bold}>Website Visitors:</Text> Anyone
                browsing our websites without an account;
              </Text>
              <Text style={styles.listItem}>
                <Text style={styles.bold}>App Users:</Text> Users of our mobile
                applications;
              </Text>
              <Text style={styles.listItem}>
                <Text style={styles.bold}>Support Users:</Text> Anyone
                contacting our customer support;
              </Text>

              <Text style={styles.h3}>2.2 Services Covered</Text>
              <Text style={styles.paragraph}>
                This policy covers all ABX platforms and services:
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} ABX Customer Website and Mobile App
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} ABX Vendor Website and Mobile App
              </Text>
              <Text style={styles.listItem}>ABX Admin Portal</Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Customer Support Systems (chat, email, phone)
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Marketing communications and newsletters
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.h2}>3. PERSONAL DATA WE COLLECT</Text>

              <Text style={styles.h3}>
                3.1 Information You Provide Directly
              </Text>

              <Text style={styles.bold}>For Customers:</Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} <Text style={styles.bold}>Account Information:</Text>{" "}
                Name, email address, phone number, password (encrypted)
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "}{" "}
                <Text style={styles.bold}>Delivery Information:</Text> Delivery
                addresses, postcode, location preferences
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} <Text style={styles.bold}>Payment Information:</Text>{" "}
                Payment card details (tokenized and processed by third-party
                payment processors)
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} <Text style={styles.bold}>Order Information:</Text>{" "}
                Purchase history, order details, product preferences
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} <Text style={styles.bold}>Profile Information:</Text>{" "}
                Favorite shops, saved products, dietary preferences, spending
                limits
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} <Text style={styles.bold}>Communication:</Text>{" "}
                Support messages, chat transcripts, feedback, reviews
              </Text>

              <Text style={[styles.bold, styles.mt]}>For Vendors:</Text>

              <Text style={styles.listItem}>
                <DotBox />{" "}{" "}
                <Text style={styles.bold}>Business Information:</Text> Business
                name, trading name, registration number, VAT number
              </Text>

              <Text style={styles.listItem}>
                <DotBox />{" "} <Text style={styles.bold}>Contact Information:</Text>{" "}
                Name, email, phone number, business address
              </Text>

              <Text style={styles.listItem}>
                <DotBox />{" "}{" "}
                <Text style={styles.bold}>Financial Information:</Text> Bank
                account details, tax information, transaction history
              </Text>

              <Text style={styles.listItem}>
                <DotBox />{" "}{" "}
                <Text style={styles.bold}>Verification Documents:</Text> ID
                documents, business licenses, food hygiene certificates,
                insurance documents
              </Text>

              <Text style={styles.listItem}>
                <DotBox />{" "} <Text style={styles.bold}>Product Information:</Text>{" "}
                Product listings, descriptions, images, inventory data
              </Text>

              <Text style={styles.listItem}>
                <DotBox />{" "} <Text style={styles.bold}>Performance Data:</Text>{" "}
                Sales metrics, customer ratings, order fulfillment statistics
              </Text>

              <Text style={[styles.bold, styles.mt]}>For Delivery Agents:</Text>

              <Text style={styles.listItem}>
                <DotBox />{" "}{" "}
                <Text style={styles.bold}>Personal Information:</Text> Name,
                contact details, emergency contact
              </Text>

              <Text style={styles.listItem}>
                <DotBox />{" "}{" "}
                <Text style={styles.bold}>Verification Documents:</Text> ID
                documents, driver's license, vehicle registration, insurance
              </Text>

              <Text style={styles.listItem}>
                <DotBox />{" "} <Text style={styles.bold}>Performance Data:</Text>{" "}
                Delivery completion rates, location tracking during deliveries,
                customer ratings
              </Text>

              <Text style={styles.h3}>
                3.2 Information Collected Automatically
              </Text>

              <Text style={styles.listItem}>
                <DotBox />{" "} <Text style={styles.bold}>Device Information:</Text>{" "}
                IP address, browser type, device type, operating system, unique
                device identifiers
              </Text>

              <Text style={styles.listItem}>
                <DotBox />{" "} <Text style={styles.bold}>Usage Data:</Text> Pages
                visited, features used, time spent, click patterns, search
                queries
              </Text>

              <Text style={styles.listItem}>
                <DotBox />{" "} <Text style={styles.bold}>Location Data:</Text> GPS
                coordinates (with permission), postcode-based location, delivery
                addresses
              </Text>

              <Text style={styles.listItem}>
                <DotBox />{" "}
                <Text style={styles.bold}>Cookies and Tracking:</Text> Session
                cookies, preference cookies, analytics cookies, advertising
                cookies
              </Text>

              <Text style={styles.listItem}>
                <DotBox />{" "} <Text style={styles.bold}>Log Data:</Text> Access
                times, error logs, system interactions
              </Text>

              <Text style={styles.h3}>3.3 Information from Third Parties</Text>

              <Text style={styles.listItem}>
                <DotBox />{" "} <Text style={styles.bold}>Payment Processors:</Text>{" "}
                Payment verification, transaction status, fraud prevention data
              </Text>

              <Text style={styles.listItem}>
                <DotBox />{" "}
                <Text style={styles.bold}>Identity Verification Services:</Text>{" "}
                Age verification, identity confirmation, business validation
              </Text>

              <Text style={styles.listItem}>
                <DotBox />{" "} <Text style={styles.bold}>Social Media:</Text> If you
                use social login features (with your consent)
              </Text>

              <Text style={styles.listItem}>
                <DotBox />{" "} <Text style={styles.bold}>Public Sources:</Text>{" "}
                Companies House data for vendor verification
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.h2}>4. HOW WE USE YOUR PERSONAL DATA</Text>

              <Text style={styles.h3}>4.1 Legal Basis for Processing</Text>
              <Text style={styles.paragraph}>
                Under UK GDPR, we must have a lawful basis to process your
                personal data. We rely on the following legal bases:
              </Text>

              <View style={styles.tableContainer}>
                <View style={styles.tableRow}>
                  <Text
                    style={[
                      styles.tableCell,
                      styles.tableCellHeader,
                      styles.tableCellLeft,
                    ]}
                  >
                    Purpose
                  </Text>
                  <Text
                    style={[
                      styles.tableCell,
                      styles.tableCellHeader,
                      styles.tableCellRight,
                    ]}
                  >
                    Legal Basis
                  </Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={[styles.tableCell, styles.tableCellLeft]}>
                    Processing orders and payments
                  </Text>
                  <Text style={[styles.tableCell, styles.tableCellRight]}>
                    Contractual necessity
                  </Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={[styles.tableCell, styles.tableCellLeft]}>
                    Creating and managing accounts
                  </Text>
                  <Text style={[styles.tableCell, styles.tableCellRight]}>
                    Contractual necessity
                  </Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={[styles.tableCell, styles.tableCellLeft]}>
                    Vendor verification and onboarding
                  </Text>
                  <Text style={[styles.tableCell, styles.tableCellRight]}>
                    Contractual necessity & Legal obligation
                  </Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={[styles.tableCell, styles.tableCellLeft]}>
                    Customer support
                  </Text>
                  <Text style={[styles.tableCell, styles.tableCellRight]}>
                    Contractual necessity & Legitimate interests
                  </Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={[styles.tableCell, styles.tableCellLeft]}>
                    Fraud prevention and security
                  </Text>
                  <Text style={[styles.tableCell, styles.tableCellRight]}>
                    Legitimate interests & Legal obligation
                  </Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={[styles.tableCell, styles.tableCellLeft]}>
                    Platform improvements and analytics
                  </Text>
                  <Text style={[styles.tableCell, styles.tableCellRight]}>
                    Legitimate interests
                  </Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={[styles.tableCell, styles.tableCellLeft]}>
                    Marketing communications
                  </Text>
                  <Text style={[styles.tableCell, styles.tableCellRight]}>
                    Consent (which you can withdraw anytime)
                  </Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={[styles.tableCell, styles.tableCellLeft]}>
                    Tax and accounting compliance
                  </Text>
                  <Text style={[styles.tableCell, styles.tableCellRight]}>
                    Legal obligation
                  </Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={[styles.tableCell, styles.tableCellLeft]}>
                    Delivery tracking (GPS)
                  </Text>
                  <Text style={[styles.tableCell, styles.tableCellRight]}>
                    Consent
                  </Text>
                </View>
              </View>

              <Text style={styles.h3}>4.2 Specific Uses by User Type</Text>

              <Text style={styles.bold}>Customer Data Used For:</Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Processing and fulfilling your orders
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Communicating order status and delivery updates
              </Text>
              <Text style={styles.listItem}>Providing customer support</Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Personalizing your shopping experience and
                recommendations
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Managing your account and preferences
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Processing payments and refunds
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Showing nearby shops based on your postcode
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Preventing fraud and ensuring platform security
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Sending service updates and important notifications
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Marketing communications (with consent)
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Analyzing usage to improve our services
              </Text>

              {/* Vendor data used for  */}
              <Text style={styles.bold} className="mt-2">
               Vendor Data Used For:
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Verifying your business credentials and identity
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Managing your vendor account and shop profile
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Processing sales transactions and payments
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Facilitating order fulfillment and delivery
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Providing business analytics and performance metrics
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Communicating with you about orders and platform
                updates
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Ensuring compliance with food safety and business
                regulations
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Managing disputes and customer complaints
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Detecting and preventing fraudulent activity
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Tax reporting to HMRC (as required by law)
              </Text>

              {/* Delivery agent data used for  */}
              <Text style={styles.bold} className="mt-2">
                Delivery Agent Data Used For:
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Verifying identity and eligibility to provide
                delivery services
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Assigning deliveries based on location and
                availability
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Tracking delivery progress (GPS with consent)
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Managing performance and ratings
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Processing payments for delivery services
              </Text>
              <Text style={styles.listItem}>Ensuring safety and security</Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Resolving delivery-related issues
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.h2}>5. HOW WE SHARE YOUR PERSONAL DATA</Text>

              <Text style={styles.h3}>5.1 When We Share Data</Text>
              <Text style={styles.paragraph}>
                <DotBox />{" "} We do not sell your personal data to third parties.
                We only share your data in the following circumstances:
              </Text>

              <Text style={styles.bold}>With Vendors (For Customers):</Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Your name, delivery address, and contact information
                to fulfill orders
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Order details to prepare your purchase
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Vendors are independent data controllers for this
                information
              </Text>

              {/* with customers for vneodors  */}
              <Text style={styles.bold}>With Customers (For Vendors):</Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Shop name, location, and contact information
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Product information and availability
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Business ratings and reviews
              </Text>

              {/* With Delivery Partners: */}

              <Text style={styles.bold}>With Delivery Partners:</Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Customer name, delivery address, and contact
                information
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Order details necessary for delivery
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Delivery instructions and preferences
              </Text>

              {/* With Service Providers: */}
              <Text style={[styles.bold, styles.mt]}>
                With Service Providers:
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Payment Processors: To process transactions securely
                (Stripe, PayPal, Revolut)
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Cloud Hosting: To store data securely (AWS, Google
                Cloud, Firebase)
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Communication Services: To send emails and
                notifications (SendGrid, Twilio)
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Analytics Providers: To understand usage patterns
                (Google Analytics)
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Customer Support Tools: To manage support tickets and
                chat
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Identity Verification: To verify vendor credentials
              </Text>

              <UrbanistText className="my-2">
                All service providers are carefully selected and required to
                protect your data in accordance with UK GDPR.
              </UrbanistText>

              <Text style={styles.h3}>5.2 Legal and Regulatory Disclosure</Text>
              <Text style={styles.paragraph}>
                We may disclose your personal data when required by law or to:
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Comply with legal obligations, court orders, or
                regulatory requests
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Report to HMRC for tax purposes (vendor financial
                data)
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Enforce our Terms and Conditions
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Protect our rights, property, or safety, or that of
                our users
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Detect, prevent, or address fraud, security, or
                technical issues
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Respond to emergency situations involving danger of
                death or serious physical injury
              </Text>

              <Text style={styles.h3}>5.3 Business Transfers</Text>
              <Text style={styles.paragraph}>
                If ABX is involved in a merger, acquisition, restructuring, or
                sale of assets, your personal data may be transferred as part of
                that transaction. We will notify you of any such change and
                ensure continued protection of your data.
              </Text>

              <Text style={styles.h3}>5.4 International Transfers</Text>
              <Text style={styles.paragraph}>
                Your personal data is primarily stored and processed in the
                United Kingdom. If we transfer data outside the UK/EEA, we
                ensure appropriate safeguards are in place, such as:
              </Text>

              <Text style={styles.listItem}>
                <DotBox />{" "} Standard Contractual Clauses approved by the ICO.
              </Text>
              <Text style={styles.listItem}>
                Adequacy decisions recognizing equivalent data protection.
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Binding Corporate Rules for multinational service
                providers.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.h2}>6. YOUR DATA PROTECTION RIGHTS</Text>

              <Text style={styles.h3}>6.1 Rights Under UK GDPR</Text>
              <Text style={styles.paragraph}>
                You have the following rights regarding your personal data:
              </Text>

              <View>
                <Text style={styles.numberedItem}>
                  1.{" "}
                  <Text style={styles.bold}>
                    Right of Access (Subject Access Request):
                  </Text>
                </Text>

                <Text style={styles.listItem}>
                  <DotBox />{" "} Request a copy of the personal data we hold about
                  you
                </Text>
                <Text style={styles.listItem}>
                  <DotBox />{" "} We will provide this free of charge within one
                  month
                </Text>
                <Text style={styles.listItem}>
                  <DotBox />{" "} You can make a request by emailing dpo@abx.com
                </Text>
              </View>

              <Text style={styles.numberedItem}>
                2. <Text style={styles.bold}>Right to Rectification:</Text>
              </Text>

              <Text style={styles.listItem}>
                <DotBox />{" "} Correct inaccurate or incomplete personal data
              </Text>

              <Text style={styles.listItem}>
                <DotBox />{" "} Update your name and email directly in your profile
                settings
              </Text>

              <Text style={styles.listItem}>
                <DotBox />{" "} Contact support for other corrections
              </Text>

              <Text style={styles.numberedItem}>
                3.{" "}
                <Text style={styles.bold}>
                  Right to Erasure ("Right to be Forgotten"):
                </Text>
              </Text>

              <Text style={styles.listItem}>
                <DotBox />{" "} Request deletion of your personal data
              </Text>

              <Text style={styles.listItem}>
                <DotBox />{" "} Use the account deletion feature or email dpo@abx.com
              </Text>

              <Text style={styles.listItem}>
                <DotBox />{" "} Note: We may retain certain data for legal
                obligations (e.g., transaction records for 7 years for tax
                purposes)
              </Text>

              <Text style={styles.numberedItem}>
                4.{" "}
                <Text style={styles.bold}>Right to Restrict Processing:</Text>
              </Text>

              <Text style={styles.listItem}>
                <DotBox />{" "} Request that we limit how we use your data
              </Text>

              <Text style={styles.listItem}>
                <DotBox />{" "} Applies when you contest accuracy or object to
                processing
              </Text>

              <Text style={styles.numberedItem}>
                5. <Text style={styles.bold}>Right to Data Portability:</Text>
              </Text>

              <Text style={styles.listItem}>
                <DotBox />{" "} Receive your personal data in a structured,
                machine-readable format
              </Text>

              <Text style={styles.listItem}>
                <DotBox />{" "} Transfer your data to another service provider
              </Text>

              <Text style={styles.listItem}>
                <DotBox />{" "} Request via dpo@abx.com
              </Text>

              <Text style={styles.numberedItem}>
                6. <Text style={styles.bold}>Right to Object:</Text>
              </Text>

              <Text style={styles.listItem}>
                <DotBox />{" "} Object to processing based on legitimate interests
              </Text>

              <Text style={styles.listItem}>
                <DotBox />{" "} Object to direct marketing (opt-out links in all
                marketing emails)
              </Text>

              <Text style={styles.listItem}>
                <DotBox />{" "} Object to automated decision-making and profiling
              </Text>

              <Text style={styles.numberedItem}>
                7. <Text style={styles.bold}>Right to Withdraw Consent:</Text>
              </Text>

              <Text style={styles.listItem}>
                <DotBox />{" "} Withdraw consent at any time for processing based on
                consent
              </Text>

              <Text style={styles.listItem}>
                <DotBox />{" "} Does not affect lawfulness of processing before
                withdrawal
              </Text>

              <Text style={styles.listItem}>
                <DotBox />{" "} Manage preferences in your account settings
              </Text>

              <Text style={styles.h3}>6.2 How to Exercise Your Rights</Text>
              <Text style={styles.paragraph}>
                To exercise any of these rights:
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Email our Data Protection Officer:
                legal@abxtechnologies.co.uk
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Use the account management features in your profile
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Contact customer support through the platform
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Write to us at our registered address
              </Text>

              <UrbanistText className="py-2 text-[14px] text-[#4B5563] ">
                We will respond to all requests within one month. If your
                request is complex, we may extend this by two additional months
                and will notify you.
              </UrbanistText>

              <Text style={styles.h3}>6.3 Right to Lodge a Complaint</Text>
              <Text style={styles.paragraph}>
                If you are unhappy with how we handle your personal data, you
                have the right to lodge a complaint with the Information
                Commissioner's Office (ICO):
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Website: www.ico.org.uk
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Phone: 0303 123 1113
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Address: Information Commissioner's Office, Wycliffe
                House, Water Lane, Wilmslow, Cheshire SK9 5AF
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.h2}>7. DATA RETENTION</Text>

              <Text style={styles.h3}>7.1 How Long We Keep Your Data</Text>
              <Text style={styles.paragraph}>
                We retain your personal data only as long as necessary for the
                purposes for which it was collected:
              </Text>

              <View style={styles.tableContainer}>
                <View style={styles.tableRow}>
                  <Text
                    style={[
                      styles.tableCell,
                      styles.tableCellHeader,
                      styles.tableCellLeft,
                    ]}
                  >
                    Data Type
                  </Text>
                  <Text
                    style={[
                      styles.tableCell,
                      styles.tableCellHeader,
                      styles.tableCellLeft,
                    ]}
                  >
                    Retention Period
                  </Text>
                  <Text
                    style={[
                      styles.tableCell,
                      styles.tableCellHeader,
                      styles.tableCellRight,
                    ]}
                  >
                    Reason
                  </Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={[styles.tableCell, styles.tableCellLeft]}>
                    Account Information
                  </Text>
                  <Text style={[styles.tableCell, styles.tableCellLeft]}>
                    Duration of account + 90 days after deletion
                  </Text>
                  <Text style={[styles.tableCell, styles.tableCellRight]}>
                    Service provision, account recovery period
                  </Text>
                </View>

                <View style={styles.tableRow}>
                  <Text style={[styles.tableCell, styles.tableCellLeft]}>
                    Transaction Records
                  </Text>
                  <Text style={[styles.tableCell, styles.tableCellLeft]}>
                    7 years from transaction date
                  </Text>
                  <Text style={[styles.tableCell, styles.tableCellRight]}>
                    HMRC tax requirements, legal obligations
                  </Text>
                </View>

                <View style={styles.tableRow}>
                  <Text style={[styles.tableCell, styles.tableCellLeft]}>
                    Vendor Financial Data
                  </Text>
                  <Text style={[styles.tableCell, styles.tableCellLeft]}>
                    7 years from last transaction
                  </Text>
                  <Text style={[styles.tableCell, styles.tableCellRight]}>
                    Tax compliance, audit requirements
                  </Text>
                </View>

                <View style={styles.tableRow}>
                  <Text style={[styles.tableCell, styles.tableCellLeft]}>
                    Marketing Consent
                  </Text>
                  <Text style={[styles.tableCell, styles.tableCellLeft]}>
                    Until consent withdrawn + 30 days
                  </Text>
                  <Text style={[styles.tableCell, styles.tableCellRight]}>
                    Compliance verification
                  </Text>
                </View>

                <View style={styles.tableRow}>
                  <Text style={[styles.tableCell, styles.tableCellLeft]}>
                    Support Communications
                  </Text>
                  <Text style={[styles.tableCell, styles.tableCellLeft]}>
                    3 years from last interaction
                  </Text>
                  <Text style={[styles.tableCell, styles.tableCellRight]}>
                    Quality assurance, dispute resolution
                  </Text>
                </View>

                <View style={styles.tableRow}>
                  <Text style={[styles.tableCell, styles.tableCellLeft]}>
                    Website Analytics
                  </Text>
                  <Text style={[styles.tableCell, styles.tableCellLeft]}>
                    26 months
                  </Text>
                  <Text style={[styles.tableCell, styles.tableCellRight]}>
                    Service improvement
                  </Text>
                </View>

                <View style={styles.tableRow}>
                  <Text style={[styles.tableCell, styles.tableCellLeft]}>
                    CCTV/Security Logs
                  </Text>
                  <Text style={[styles.tableCell, styles.tableCellLeft]}>
                    30 days
                  </Text>
                  <Text style={[styles.tableCell, styles.tableCellRight]}>
                    Security purposes
                  </Text>
                </View>
              </View>

              <Text style={styles.h3}>7.2 Deletion and Anonymization</Text>
              <Text style={styles.paragraph}>
                When retention periods expire, we either:
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Delete: Permanently remove personal data from our
                systems
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Anonymize: Remove identifying information so data
                cannot be linked to you
              </Text>

              <Text style={styles.paragraph}>
                Some anonymized data may be retained indefinitely for
                statistical and research purposes.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.h2}>8. DATA SECURITY</Text>

              <Text style={styles.h3}>8.1 Security Measures</Text>
              <Text style={styles.paragraph}>
                We implement appropriate technical and organizational measures
                to protect your personal data:
              </Text>

              <Text style={styles.bold}>Technical Measures:</Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Encryption of data in transit (TLS/SSL) and at rest
                (AES-256)
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Secure password storage using industry-standard
                hashing (bcrypt)
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Firewalls and intrusion detection systems
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Regular security testing and vulnerability
                assessments
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Payment card data tokenization (PCI-DSS compliant
                processors)
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Regular backups stored securely
              </Text>

              <Text style={styles.listItem}>
                <DotBox />{" "} Multi-factor authentication for admin access
              </Text>

              <Text style={[styles.bold, styles.mt]}>
                Organizational Measures:
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Access controls limiting who can access personal data
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Staff training on data protection and security
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Confidentiality agreements with employees and
                contractors
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Data protection impact assessments for high-risk
                processing
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Incident response procedures
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Regular security audits and compliance reviews
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Vendor security assessments for third-party
                processors
              </Text>

              <Text style={styles.h3}>8.2 Your Responsibilities</Text>
              <Text style={styles.paragraph}>
                You can help keep your data secure by:
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Using a strong, unique password for your account
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Not sharing your login credentials with anyone
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Logging out after using shared devices
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Reporting suspicious activity immediately
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Being cautious of phishing emails pretending to be
                from ABX
              </Text>

              <Text style={styles.h3}>8.3 Data Breach Notification</Text>
              <Text style={styles.paragraph}>
                In the event of a personal data breach that poses a risk to your
                rights and freedoms, we will:
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Notify the ICO within 72 hours of becoming aware
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Notify affected individuals without undue delay
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Provide information about the nature of the breach
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Advise on steps you can take to protect yourself
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Describe measures we are taking to address the breach
              </Text>
            </View>

            {/* 9.COOKIES AND TRACKING TECHNOLOGIES  */}
            <View style={styles.section}>
              <Text style={styles.h2}>
                9. COOKIES AND TRACKING TECHNOLOGIES
              </Text>

              <Text style={styles.h3}>9.1 What Are Cookies</Text>
              <Text style={styles.paragraph}>
                Cookies are small text files stored on your device when you
                visit our websites or use our apps. They help us provide a
                better user experience and understand how our services are used.
              </Text>

              <Text style={styles.h3}>9.2 Types of Cookies We Use</Text>

              <View style={styles.tableContainer}>
                <View style={styles.tableRow}>
                  <Text
                    style={[
                      styles.tableCell,
                      styles.tableCellHeader,
                      styles.tableCellLeft,
                    ]}
                  >
                    Cookie Type
                  </Text>
                  <Text
                    style={[
                      styles.tableCell,
                      styles.tableCellHeader,
                      styles.tableCellLeft,
                    ]}
                  >
                    Purposewil
                  </Text>
                  <Text
                    style={[
                      styles.tableCell,
                      styles.tableCellHeader,
                      styles.tableCellRight,
                    ]}
                  >
                    Duration
                  </Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={[styles.tableCell, styles.tableCellLeft]}>
                    Strictly Necessary
                  </Text>
                  <Text style={[styles.tableCell, styles.tableCellLeft]}>
                    Essential for website functionality, authentication,
                    security
                  </Text>
                  <Text style={[styles.tableCell, styles.tableCellRight]}>
                    Session or up to 1 year
                  </Text>
                </View>

                <View style={styles.tableRow}>
                  <Text style={[styles.tableCell, styles.tableCellLeft]}>
                    Functional
                  </Text>
                  <Text style={[styles.tableCell, styles.tableCellLeft]}>
                    Remember preferences, language settings, location
                  </Text>
                  <Text style={[styles.tableCell, styles.tableCellRight]}>
                    Up to 2 years
                  </Text>
                </View>

                <View style={styles.tableRow}>
                  <Text style={[styles.tableCell, styles.tableCellLeft]}>
                    Analytics
                  </Text>
                  <Text style={[styles.tableCell, styles.tableCellLeft]}>
                    Understand how visitors use our services (Google Analytics)
                  </Text>
                  <Text style={[styles.tableCell, styles.tableCellRight]}>
                    Up to 26 months
                  </Text>
                </View>

                <View style={styles.tableRow}>
                  <Text style={[styles.tableCell, styles.tableCellLeft]}>
                    Marketing
                  </Text>
                  <Text style={[styles.tableCell, styles.tableCellLeft]}>
                    Deliver relevant ads, track campaign performance
                  </Text>
                  <Text style={[styles.tableCell, styles.tableCellRight]}>
                    Up to 13 months
                  </Text>
                </View>
              </View>

              <Text style={styles.h3}>9.3 Managing Cookies</Text>
              <Text style={styles.paragraph}>
                You can control cookies through:
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Cookie Consent Banner: Manage preferences when you
                first visit
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Cookie Settings: Update preferences in your account
                settings
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Browser Settings: Most browsers allow you to refuse
                or delete cookies
              </Text>

              <Text style={styles.paragraph}>
                Note: Disabling strictly necessary cookies may affect website
                functionality.
              </Text>

              <Text style={styles.h3}>9.4 Third-Party Cookies</Text>
              <Text style={styles.paragraph}>
                We use third-party services that may set their own cookies:
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Google Analytics: Website traffic analysis and user
                behavior
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Payment Processors: Secure transaction processing
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Social Media Plugins: Sharing and social login
                features
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Advertising Networks: Targeted advertising (with
                consent)
              </Text>

              <Text style={styles.paragraph}>
                These third parties have their own privacy policies governing
                cookie use.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.h2}>10. CHILDREN'S PRIVACY</Text>

              <Text style={styles.h3}>10.1 Age Restrictions</Text>
              <Text style={styles.paragraph}>
                Our services are not intended for children under the age of 18.
                We do not knowingly collect personal data from children. If you
                are under 18, please do not use our services or provide any
                personal information.
              </Text>

              <Text style={styles.h3}>10.2 Parental Notice</Text>
              <Text style={styles.paragraph}>
                If we become aware that we have collected personal data from a
                child under 18 without verification of parental consent, we will
                take steps to delete that information as quickly as possible. If
                you believe we have collected information from a child, please
                contact us immediately at dpo@abx.com.
              </Text>

              <Text style={styles.h3}>10.3 Age Verification</Text>
              <Text style={styles.paragraph}>
                For certain products (such as alcohol or age-restricted items),
                we implement age verification measures at the point of delivery
                to ensure compliance with UK law.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.h2}>
                11. AUTOMATED DECISION-MAKING AND PROFILING
              </Text>

              <Text style={styles.h3}>
                11.1 How We Use Automated Processing
              </Text>
              <Text style={styles.paragraph}>
                We use automated decision-making and profiling in limited
                circumstances to improve your experience:
              </Text>
              <Text style={styles.h3}>Product Recommendations:</Text>

              <Text style={styles.listItem}>
                <DotBox />{" "} We analyze your browsing and purchase history to
                suggest products you might like
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} This is based on legitimate interests to enhance user
                experience
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "}
                You can opt out by adjusting your privacy settings
              </Text>

              <Text style={styles.h3}>Fraud Detection:</Text>

              <Text style={styles.listItem}>
                <DotBox />{" "} Automated systems analyze transaction patterns to
                detect fraudulent activity
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} This protects both you and our vendors from fraud
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Based on legitimate interests and legal obligations
              </Text>

              <Text style={styles.h3}>Vendor Performance Monitoring:</Text>

              <Text style={styles.listItem}>
                <DotBox />{" "} Automated systems track vendor metrics (delivery
                times, customer ratings)
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Used to maintain service quality standards
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Vendors can request manual review of automated
                decisions
              </Text>

              <Text style={styles.h3}>
                11.2 Your Rights Regarding Automated Decisions
              </Text>
              <Text style={styles.paragraph}>You have the right to:</Text>

              <Text style={styles.listItem}>
                <DotBox />{" "} Request human intervention in automated decisions
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Express your point of view regarding the decision
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Contest decisions that significantly affect you
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Request an explanation of how the decision was made
              </Text>

              <Text style={styles.paragraph}>
                To exercise these rights, contact info@abxtechnologies.co.uk
                with details of the decision in question.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.h2}>12. MARKETING COMMUNICATIONS</Text>

              <Text style={styles.h3}>12.1 Types of Marketing</Text>
              <Text style={styles.paragraph}>
                With your consent, we may send you marketing communications
                about:
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} New products and special offers from vendors
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Platform updates and new features
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Personalized promotions based on your preferences
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Seasonal campaigns and limited-time deals
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Vendor promotions and local shop highlights
              </Text>

              <Text style={styles.h3}>12.2 How We Send Marketing</Text>

              <Text style={styles.listItem}>
                <DotBox />{" "} Email: Newsletters, promotional offers, product
                updates
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Push Notifications: App notifications about deals and
                orders
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} SMS: Text messages for time-sensitive offers (with
                explicit consent)
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} In-App Messages: Banners and notifications within the
                platform
              </Text>

              <Text style={styles.h3}>12.3 Managing Your Preferences</Text>
              <Text style={styles.paragraph}>
                You can control marketing communications at any time:
              </Text>

              <Text style={styles.listItem}>
                <DotBox />{" "} Click "Unsubscribe" links in marketing emails
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Adjust notification settings in your account
                preferences
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "}
                Reply "STOP" to marketing SMS messages
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Turn off push notifications in your device settings
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Contact info@abxtechnologies.co.uk to update all
                preferences
              </Text>
              <Text style={styles.paragraph}>
                Note: You will continue to receive essential service
                communications (order confirmations, delivery updates, account
                notifications) regardless of marketing preferences.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.h2}>13. LINKS TO THIRD-PARTY WEBSITES</Text>
              <Text style={styles.h3}>13.1 External Links</Text>
              <Text style={styles.paragraph}>
                Our platforms may contain links to third-party websites,
                including vendor websites, social media platforms, and partner
                services. This Privacy Policy does not apply to those external
                sites.
              </Text>

              <Text style={styles.h3}>13.2 Third-Party Responsibility</Text>
              <Text style={styles.paragraph}>
                We are not responsible for the privacy practices or content of
                third-party websites. We encourage you to read the privacy
                policies of any external sites you visit through our platform.
              </Text>

              <Text style={styles.h3}>13.3 Social Media Integration</Text>
              <Text style={styles.paragraph}>
                If you use social media features (such as sharing products or
                social login), information may be shared with those platforms
                according to their own privacy policies.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.h2}>14. CHANGES TO THIS PRIVACY POLICY</Text>
              <Text style={styles.h3}>14.1 Policy Updates</Text>
              <Text style={styles.paragraph}>
                We may update this Privacy Policy from time to time to reflect
                changes in our practices, technology, legal requirements, or
                other factors. When we make changes, we will:
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Update the "Last Updated" date at the top of this
                policy
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Notify you via email if the changes are significant
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Display a prominent notice on our platforms
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Request renewed consent where required by law
              </Text>

              <Text style={styles.h3}>14.2 Your Acceptance</Text>
              <Text style={styles.paragraph}>
                By continuing to use our services after changes become
                effective, you accept the updated Privacy Policy. If you do not
                agree with any changes, you should stop using our services and
                may request account deletion.
              </Text>

              <Text style={styles.h3}>14.3 Review History</Text>
              <Text style={styles.paragraph}>
                Previous versions of this Privacy Policy are available upon
                request by contacting dpo@abx.com.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.h2}>15. CONTACT INFORMATION</Text>

              <Text style={styles.h3}>15.1 How to Contact Us</Text>
              <Text style={styles.paragraph}>
                If you have questions, concerns, or requests regarding this
                Privacy Policy or our data practices, please contact us:
              </Text>

              <View>
                <Text style={styles.bold}>Data Protection Officer:</Text>
                <Text style={styles.paragraph}>
                  Email: info@abxtechnologies.co.uk
                </Text>
                <Text style={styles.paragraph}>
                  Response time: Within 5 business days
                </Text>

                <Text style={[styles.h3]}>Privacy Inquiries:</Text>
                <Text style={styles.paragraph}>
                  Email: info@abxtechnologies.co.uk
                </Text>
                <Text style={styles.paragraph}>Phone: 07478687182</Text>
                <Text style={styles.paragraph}>
                  Hours: Monday-Friday, 9:00 AM - 6:00 PM GMT
                </Text>

                <Text style={[styles.h3]}>Postal Address:</Text>
                <Text style={styles.paragraph}>
                  Afrobasket Express Technology Limited
                </Text>
                <Text style={styles.paragraph}>16 newcroft drive glasgow</Text>
                <Text style={styles.paragraph}>United Kingdom</Text>
              </View>

              <Text style={styles.h3}>15.2 Response Times</Text>
              <Text style={styles.paragraph}>
                We aim to respond to all privacy inquiries within:
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} General questions: 5 business days
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Subject Access Requests: 30 calendar days
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Data deletion requests: 30 calendar days
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Urgent matters: 48 hours
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.h2}>
                16. ADDITIONAL INFORMATION FOR SPECIFIC USERS
              </Text>
              <Text style={styles.h3}>16.1 For Customers</Text>
              <Text style={styles.paragraph}>
                Your Order Data: When you place an order, your information is
                shared with the vendor and delivery agent to fulfill your
                purchase. Both parties act as independent data controllers for
                the information they receive.
              </Text>
              <Text style={styles.paragraph}>
                Reviews and Ratings: When you leave a review, your first name
                and review content will be publicly visible. You can request
                removal of reviews by contacting support.
              </Text>

              <Text style={styles.h3}>16.2 For Vendors</Text>
              <Text style={styles.paragraph}>
                Dual Role: As a vendor, you are both a data subject (for your
                personal business data) and a data controller (for customer
                information you receive through orders).
              </Text>

              <Text style={styles.paragraph}>
                Compliance Obligations: You must comply with UK GDPR when
                handling customer data received through our platform. ABX
                provides guidance but you are responsible for your own
                compliance.
              </Text>

              <Text style={styles.paragraph}>
                Data Sharing: Your business name, location, ratings, and product
                information will be publicly visible on our platform.
              </Text>

              <Text style={styles.h3}>16.3 For Delivery Agents</Text>
              <Text style={styles.paragraph}>
                Location Tracking: GPS tracking during active deliveries helps
                ensure customer satisfaction and your safety. You can disable
                tracking when not making deliveries.
              </Text>
              <Text style={styles.paragraph}>
                Performance Metrics: Your delivery ratings and completion
                statistics are used to maintain service quality and may affect
                your eligibility for future deliveries.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.h2}>17. GLOSSARY OF TERMS</Text>
              <Text style={styles.paragraph}>
                For clarity, here are definitions of key terms used in this
                Privacy Policy:
              </Text>

              <Text style={styles.listItem}>
                <DotBox />{" "} Personal Data: Any information relating to an
                identified or identifiable person.
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Processing: Any operation performed on personal data,
                including collection, storage, use, and deletion.
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Data Controller: The entity that determines the
                purposes and means of processing personal data.
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Data Processor: An entity that processes data on
                behalf of the data controller.
              </Text>

              <Text style={styles.listItem}>
                <DotBox />{" "} Data Subject: The individual whose personal data is
                being processed.
              </Text>

              <Text style={styles.listItem}>
                <DotBox />{" "} Consent: Freely given, specific, informed, and
                unambiguous agreement to data processing.
              </Text>

              <Text style={styles.listItem}>
                <DotBox />{" "} UK GDPR: The UK General Data Protection Regulation,
                the primary data protection law in the UK.
              </Text>

              <Text style={styles.listItem}>
                <DotBox />{" "} ICO: Information Commissioner's Office, the UK's
                independent data protection authority.
              </Text>

              <Text style={styles.listItem}>
                <DotBox />{" "} Legitimate Interests: A legal basis for processing
                when it's necessary for purposes that are in our or a third
                party's legitimate interests.
              </Text>

              <Text style={styles.listItem}>
                <DotBox />{" "} Pseudonymization: Processing data so it can no longer
                be attributed to a specific person without additional
                information.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.h2}>18. LEGAL COMPLIANCE</Text>
              <Text style={styles.h3}>18.1 Applicable Laws</Text>

              <Text style={styles.paragraph}>
                This Privacy Policy and our data processing practices comply
                with:
              </Text>

              <Text style={styles.listItem}>
                <DotBox />{" "} UK General Data Protection Regulation (UK GDPR).
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Data Protection Act 2018.
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Privacy and Electronic Communications Regulations
                (PECR) 2003.
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Electronic Commerce (EC Directive) Regulations 2002.
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Consumer Rights Act 2015.
              </Text>

              <Text style={styles.h3}>18.2 Data Protection Registration</Text>

              <Text style={styles.paragraph}>
                Afrobasket Express Technology Limited is registered with the
                Information Commissioner's Office (ICO) as required under the
                Data Protection Act 2018. Our ICO registration number is [ICO
                Registration Number].
              </Text>

              <Text style={styles.h3}>18.3 Compliance Monitoring</Text>

              <Text style={styles.paragraph}>
                We regularly review and update our data protection practices to
                ensure ongoing compliance with applicable laws and regulations.
                This includes:
              </Text>

              <Text style={styles.listItem}>
                <DotBox />{" "} Annual data protection audits
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Regular staff training on data protection
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Data Protection Impact Assessments for new processing
                activities
              </Text>
              <Text style={styles.listItem}>
                <DotBox />{" "} Monitoring changes in data protection legislation
              </Text>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Policy Version: 1.0 | Effective Date: November 10, 2025 | Last
                Updated: November 10, 2025
              </Text>
              <Text style={styles.footerText}>
                © 2025 Afrobasket Express Technology Limited. All rights
                reserved.
              </Text>
              <Text style={styles.footerText}>
                Questions? Contact our Data Protection Officer at
                legal@abxtechnologies.co.uk
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  breadcrumb: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  breadcrumbButton: {
    padding: 4,
  },
  chevron: {
    marginHorizontal: 4,
  },
  breadcrumbText: {
    fontSize: 14,
    color: "#00B207",
    fontWeight: "500",
    fontFamily: "UrbanistMedium",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingBottom: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "#2D2220",
    marginBottom: 8,
    fontFamily: "UrbanistSemiBold",
  },
  subtitle: {
    fontSize: 12,
    color: "#6B7280",
    fontFamily: "UrbanistRegular",
  },
  metaBox: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  metaText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#374151",
    marginVertical: 2,
    fontFamily: "UrbanistMedium",
  },
  section: {
    marginBottom: 24,
  },
  h2: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0C513F",
    marginTop: 16,
    marginBottom: 12,
    fontFamily: "UrbanistSemiBold",
  },
  h3: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2D2220",
    marginTop: 12,
    marginBottom: 8,
    fontFamily: "UrbanistSemiBold",
  },
  paragraph: {
    fontSize: 14,
    color: "#4B5563",
    lineHeight: 21,
    marginBottom: 8,
    fontFamily: "UrbanistRegular",
  },
  bold: {
    fontWeight: "600",
    color: "#2D2220",
    fontFamily: "UrbanistSemiBold",
    paddingVertical: 6,
  },
  listItem: {
    fontSize: 14,
    color: "#4B5563",
    lineHeight: 21,
    marginLeft: 8,
    marginBottom: 6,
    fontFamily: "UrbanistRegular",
  },
  numberedItem: {
    fontSize: 14,
    color: "#4B5563",
    lineHeight: 21,
    marginBottom: 8,
    fontFamily: "UrbanistSemiBold",
  },
  mt: {
    marginTop: 12,
  },
  infoBox: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    padding: 12,
    marginVertical: 12,
  },
  tableContainer: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    marginVertical: 12,
    overflow: "scroll",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  tableCell: {
    flex: 1,
    padding: 12,
    fontSize: 12,
    color: "#4B5563",
    fontFamily: "UrbanistRegular",
  },
  tableCellHeader: {
    backgroundColor: "#0C513F",
    fontWeight: "600",
    color: "#fff",
    textTransform: "uppercase",
    fontSize: 11,
    fontFamily: "UrbanistSemiBold",
  },
  tableCellLeft: {
    borderRightWidth: 1,
    borderRightColor: "#E5E7EB",
  },
  tableCellRight: {
    flex: 1,
  },
  contactBox: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    padding: 16,
    marginTop: 12,
  },
  footer: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    alignItems: "center",
  },
  footerText: {
    fontSize: 11,
    color: "#6B7280",
    textAlign: "center",
    marginVertical: 4,
    fontFamily: "UrbanistRegular",
  },
});

export default PrivacyPolicyScreen;
