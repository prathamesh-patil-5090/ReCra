import React, { useState } from 'react';
import { Check, Info } from 'lucide-react';
// Add custom Tooltip component
const Tooltip = ({ children, content }) => (
  <div className="relative flex flex-col items-center group">
    {children}
    <div className="absolute bottom-0 flex flex-col items-center hidden mb-6 group-hover:flex">
      <span className="relative z-10 p-2 text-xs leading-none text-white whitespace-no-wrap bg-black shadow-lg rounded-md">
        {content}
      </span>
      <div className="w-3 h-3 -mt-2 rotate-45 bg-black"></div>
    </div>
  </div>
);

// Add custom Badge component
const Badge = ({ children, className }) => (
  <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${className}`}>
    {children}
  </span>
);

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');
  
  const plans = [
    {
      name: "Free",
      monthlyPrice: "0",
      yearlyPrice: "0",
      features: [
        {
          name: "Basic resume analysis",
          tooltip: "AI-powered analysis of your resume's basic structure and content"
        },
        {
          name: "1 resume review per month",
          tooltip: "Get detailed feedback once every month"
        },
        {
          name: "Basic formatting check",
          tooltip: "Ensures your resume follows standard formatting guidelines"
        },
        {
          name: "Limited template access",
          tooltip: "Access to our basic template collection"
        }
      ],
      buttonText: "Get Started",
      highlighted: false
    },
    {
      name: "Pro",
      monthlyPrice: "19",
      yearlyPrice: "190",
      badge: "Most Popular",
      features: [
        {
          name: "Advanced AI analysis",
          tooltip: "In-depth AI analysis with industry-specific recommendations"
        },
        {
          name: "Unlimited resume reviews",
          tooltip: "Get feedback as many times as you need"
        },
        {
          name: "ATS optimization",
          tooltip: "Ensure your resume passes Applicant Tracking Systems"
        },
        {
          name: "Cover letter assistance",
          tooltip: "AI-powered cover letter writing and review"
        },
        {
          name: "Priority support",
          tooltip: "Get help within 24 hours"
        },
        {
          name: "All premium templates",
          tooltip: "Access our entire collection of professional templates"
        }
      ],
      buttonText: "Try Pro",
      highlighted: true
    },
    {
      name: "Enterprise",
      monthlyPrice: "49",
      yearlyPrice: "490",
      features: [
        {
          name: "Everything in Pro",
          tooltip: "All features from the Pro plan included"
        },
        {
          name: "Custom branding",
          tooltip: "Add your company's logo and branding"
        },
        {
          name: "Team collaboration",
          tooltip: "Work together with your team members"
        },
        {
          name: "API access",
          tooltip: "Integrate with your existing tools"
        },
        {
          name: "Dedicated support",
          tooltip: "Direct line to our support team"
        },
        {
          name: "Custom integrations",
          tooltip: "We'll help you integrate with your existing workflow"
        }
      ],
      buttonText: "Contact Sales",
      highlighted: false
    }
  ];

  return (
    <>
      <div className="py-12 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Choose the perfect plan for your career growth
          </p>
          
          <div className="flex items-center justify-center gap-4 mb-8">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 rounded-lg transition-all ${
                billingCycle === 'monthly' 
                  ? 'bg-black text-white' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-2 rounded-lg transition-all ${
                billingCycle === 'yearly' 
                  ? 'bg-black text-white' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              Yearly
              <Badge className="ml-2 bg-green-100 text-green-800">
                Save 20%
              </Badge>
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-8 transition-all duration-300 hover:scale-105 relative
                ${
                  plan.name === 'Enterprise'
                    ? 'bg-gradient-to-br from-black to-gray-800 text-white'
                    : plan.highlighted
                      ? 'bg-black text-white ring-2 ring-black shadow-xl'
                      : 'bg-white text-gray-900 border border-gray-200'
                }`}
            >
              {plan.badge && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-500">
                  {plan.badge}
                </Badge>
              )}
              
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-x-2">
                  <span className="text-5xl font-bold">
                    ${billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
                  </span>
                  <span className={plan.highlighted ? 'text-gray-300' : 'text-gray-500'}>
                    /{billingCycle === 'monthly' ? 'month' : 'year'}
                  </span>
                </div>
              </div>

              <ul className="mt-8 space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature.name} className="flex items-start gap-3">
                    <Check className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{feature.name}</span>
                    <Tooltip content={feature.tooltip}>
                      <Info className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                    </Tooltip>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full mt-8 py-3 px-6 rounded-lg font-medium transition-all
                  ${
                    plan.highlighted
                      ? 'bg-white text-black hover:bg-gray-100'
                      : plan.name === 'Enterprise'
                        ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:opacity-90'
                        : 'bg-black text-white hover:bg-gray-800'
                  }`}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>

        <p className="text-center text-gray-500 mt-12">
          All plans include 14-day free trial. No credit card required.
        </p>
      </div>
    </>
  );
};

export default Pricing;