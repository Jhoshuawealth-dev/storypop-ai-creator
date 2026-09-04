# Storypop AI Creator

Build a complete, premium, mobile-first AI UGC creator application called:

STORYPOP AI

Tagline:

"Turn your ideas into engaging UGC videos with AI."

IMPORTANT:

This is a MOBILE APP FRONTEND, not a website/landing page.

Build the frontend as a polished production-quality React application that can later be connected to Supabase, OpenAI, Runway, ElevenLabs, payment providers and social-media APIs.

Do NOT build a generic dashboard.

Do NOT create a basic template.

Do NOT simplify the screens.

Build the complete application interface and navigation described below.

==================================================

1. BRAND & VISUAL IDENTITY

==================================================

Brand:

Storypop AI

Category:

AI UGC Creator App

Primary brand colour:

PURPLE ONLY.

Do NOT mix blue into the interface.

Use a premium purple colour system with:

- Deep purple

- Primary purple

- Light purple

- Very light purple backgrounds

- White

- Near-black/dark text

- Soft neutral gray for secondary text

Purple should be the only accent colour.

The application should feel:

- Premium

- Modern

- AI-native

- Creative

- Trustworthy

- Simple

- Clean

- Professional

- Creator-focused

Use generous whitespace.

Use rounded cards.

Use subtle shadows.

Use smooth transitions.

Use modern typography.

Use consistent spacing.

Use clean iconography.

Avoid:

- Excessive gradients

- Rainbow colours

- Blue accents

- Clutter

- Overly complicated enterprise UI

- Tiny unreadable text

- Desktop-first layouts

The app must look excellent on mobile screens.

==================================================

2. APP STRUCTURE

==================================================

The main application has 5 primary bottom navigation items:

1. Home

2. Projects

3. Create

4. Calendar

5. Profile

The Create button must be visually emphasized in the center.

Bottom navigation:

Home | Projects | + Create | Calendar | Profile

The bottom navigation should remain consistent throughout the authenticated application.

On mobile:

- Fixed bottom navigation

- Safe-area aware

- Clear active state

- Purple active icon/text

- Large central Create button

==================================================

3. SPLASH SCREEN

==================================================

Create a beautiful branded splash screen.

Screen:

S-01 Splash / Launch

Design:

Centered Storypop AI logo.

Use the Storypop AI icon/logo.

Below it:

STORYPOP AI

AI UGC CREATOR APP

Short tagline:

"Turn your ideas into engaging UGC videos with AI."

At the bottom:

"Creating your next story..."

Use a subtle loading animation.

Background:

Very light purple/white OR deep premium purple with white logo.

Keep it elegant.

After a short delay:

If unauthenticated → Welcome

If authenticated → Home

==================================================

4. WELCOME SCREEN

==================================================

Screen:

S-02 Welcome

Create a premium onboarding/welcome screen.

Include:

- Storypop AI logo

- Attractive animated/illustrated creator character

- Headline:

"Create amazing UGC videos with AI."

Supporting text:

"Turn your ideas, products and stories into engaging videos without filming everything yourself."

Primary CTA:

"Get Started"

Secondary CTA:

"Sign In"

Optional:

"Create content. Edit it. Publish it."

Make this screen visually impressive.

==================================================

5. REGISTRATION SCREEN

==================================================

Screen:

S-03 Create Account

This MUST look premium and polished.

Title:

"Create your Storypop AI account"

Subtitle:

"Start creating your AI-powered UGC content."

Fields:

Full name

Email address

Password

Confirm password

Password fields must include show/hide password icons.

Include:

Password strength indicator.

Terms checkbox:

"I agree to Storypop AI's Terms of Service and Privacy Policy."

Primary button:

"Create Account"

Social registration:

"Continue with Google"

"Continue with Apple"

Add divider:

"OR"

Below:

"Already have an account? Sign In"

Use excellent validation states:

- Empty

- Focus

- Error

- Valid

- Loading

Validation messages must be clear and friendly.

Example:

"Please enter a valid email address."

"Password must contain at least 8 characters."

"Passwords don't match."

When registration is submitted:

Show loading state:

"Creating your account..."

Then navigate to email verification.

==================================================

6. LOGIN SCREEN

==================================================

Screen:

S-04 Sign In

Title:

"Welcome back"

Subtitle:

"Sign in to continue creating with Storypop AI."

Fields:

Email

Password

Include:

Show/hide password.

"Forgot password?"

Primary button:

"Sign In"

Social login:

"Continue with Google"

"Continue with Apple"

Divider:

"OR"

Bottom:

"Don't have an account? Create Account"

States:

- Loading

- Invalid credentials

- Empty fields

- Successful login

Error example:

"Email or password is incorrect."

Make login visually beautiful and consistent with registration.

==================================================

7. EMAIL VERIFICATION

==================================================

Screen:

S-05 Verify Email

Title:

"Verify your email"

Text:

"We've sent a verification code to your email address."

Create 6 OTP input boxes.

Buttons:

"Verify"

"Resend code"

"Change email"

Include countdown for resend.

==================================================

8. HOME DASHBOARD

==================================================

Screen:

S-06 Home

This is the main dashboard.

Top:

Profile/avatar

Greeting:

"Good morning, Joshua 👋"

Main usage card:

"Video Minutes"

"6:42 remaining"

Show visual circular progress.

Primary button:

"+ Create UGC"

Recent Projects section.

Cards showing:

- Thumbnail

- Project name

- Duration

- Time created

- Status

Example:

"Product Promo"

"0:30"

"2 hours ago"

Quick stats:

- Videos created

- Scheduled posts

- Published posts

Bottom navigation.

==================================================

9. NOTIFICATIONS

==================================================

Screen:

S-07 Notifications

Categories:

All

Unread

Notification cards:

Video generated

Post published

Scheduled post

Subscription

Tips

Example:

"Your video is ready."

"Product Promo finished generating."

Allow:

- Mark as read

- Mark all as read

==================================================

10. VIDEO USAGE

==================================================

Screen:

S-08 Video Usage

Show current plan:

"Pro Plan"

Large circular usage indicator.

Example:

6:42 / 8:00

Show:

Used

Remaining

Reset date

Buttons:

"Upgrade Plan"

"Buy Additional Minutes"

Explain:

"Your video allowance resets every billing cycle."

==================================================

11. CREATE FLOW

==================================================

The Create flow is the core feature.

When user taps:

+ CREATE

Open:

S-09 Create Start

Options:

Start from Idea

From Product

From Template

From Existing Project

Use large beautiful cards.

==================================================

12. CONTENT IDEA

==================================================

Screen:

S-10 Content Idea

Title:

"What do you want to create?"

Large text input:

"Describe your idea..."

Fields:

Topic

Audience

Tone

Platform

CTA

Example:

"Create a funny 30-second UGC video promoting my sneaker business."

CTA:

"Generate Script"

==================================================

13. AI SCRIPT

==================================================

Screen:

S-11 AI Script

Use tabs:

Script

Hook

CTA

Show generated:

HOOK

MAIN SCRIPT

CTA

Actions:

Edit

Regenerate

Make Shorter

Make Funnier

Make More Persuasive

Strengthen Hook

Primary CTA:

"Continue"

==================================================

14. SCENE PLANNER

==================================================

Screen:

S-12 Scene Planner

Show scenes as cards.

Example:

Scene 1

Hook

0:05

Scene 2

Problem

0:07

Scene 3

Solution

0:08

Scene 4

CTA

0:10

Allow:

- Edit

- Delete

- Rearrange

- Add Scene

- Regenerate Scene

Primary:

"Continue"

==================================================

15. CHARACTER SELECTION

==================================================

Screen:

S-13 Choose Character

Title:

"Choose your AI character"

Show character cards.

Each card:

- Character image

- Character name

- Style

- Voice

Button:

"Use Character"

Secondary:

"Create New Character"

==================================================

16. VOICE SELECTION

==================================================

Screen:

S-14 Choose Voice

Voice cards.

Categories:

Male

Female

Styles:

Energetic

Professional

Calm

Funny

Friendly

Each voice should have a play preview button.

Primary:

"Next"

==================================================

17. VIDEO STYLE

==================================================

Screen:

S-15 Video Style

Styles:

3D

Cartoon

Anime

Realistic

Stylized

UGC

Cinematic

Use visual cards.

Primary:

"Next"

==================================================

18. VIDEO SETTINGS

==================================================

Screen:

S-16 Video Settings

Duration:

30 seconds

60 seconds

Custom

Aspect ratio:

9:16 Portrait

16:9 Landscape

1:1 Square

Show remaining video balance.

Primary:

"Generate Video"

==================================================

19. GENERATING VIDEO

==================================================

Screen:

S-17 Generating Video

This must feel like a real AI generation process.

Show:

Preparing idea ✓

Writing script ✓

Planning scenes ✓

Generating scenes

Creating character

Creating voice

Editing video

Finalizing

Show progress percentage.

Example:

"72%"

Message:

"This may take a few moments."

Do NOT make it look like a generic loading spinner.

==================================================

20. VIDEO RESULT

==================================================

Screen:

S-18 Video Result

Large video preview.

Controls:

Play

Pause

Mute

Show:

Title

Duration

Actions:

Edit

Regenerate

Save as Draft

Primary:

"Publish"

==================================================

21. VIDEO EDITOR

==================================================

Create a professional mobile video editor.

Screen:

S-19 Main Editor

Large video preview.

Timeline.

Editing tools:

Trim

Split

Text

Captions

Voice

Music

Effects

Transitions

Speed

Background

Character

Use horizontally scrollable editing tools.

==================================================

22. AI EDITOR

==================================================

Screen:

S-20 AI Editor

Title:

"Tell AI what to change"

Text box:

"Make this video more energetic..."

Suggested commands:

Make the first 3 seconds stronger

Add captions

Make it shorter

Make it funnier

Improve the CTA

Primary:

"Apply AI Edit"

==================================================

23. CAPTION & HASHTAG EDITOR

==================================================

Screen:

S-21 Caption & Hashtags

Generate:

Caption

Hashtags

CTA

Allow editing.

Buttons:

Copy

Edit

Regenerate

==================================================

24. CHARACTER SYSTEM

==================================================

Create the complete AI character system.

Screen:

S-22 Character Library

Show:

My Characters

Character cards.

Each card:

- Character

- Name

- Style

- Voice

- Videos using character

Button:

"+ Create Character"

==================================================

25. UPLOAD PHOTO

==================================================

Screen:

S-23 Upload Photo

Title:

"Create your AI character"

Text:

"Upload a clear photo of yourself."

Upload area.

Buttons:

Take Photo

Upload Photo

Show photo preview.

CTA:

"Continue"

==================================================

26. CHARACTER STYLE

==================================================

Screen:

S-24 Character Style

Options:

3D Avatar

Cartoon

Anime

Realistic

Stylized

Show visual previews.

CTA:

"Create Character"

==================================================

27. CHARACTER GENERATION

==================================================

Screen:

S-25 Character Generation

Show uploaded image.

Progress:

Analyzing photo

Building facial model

Applying style

Creating character

Progress percentage.

==================================================

28. CHARACTER PREVIEW

==================================================

Screen:

S-26 Character Preview

Large character preview.

Actions:

"Use Character"

"Regenerate"

"Try Another Style"

==================================================

29. CHARACTER PROFILE

==================================================

Screen:

S-27 Character Profile

Show:

Character

Name

Style

Voice

Created date

Videos using character

Actions:

Edit

Use in Video

Delete

==================================================

30. PROJECTS

==================================================

Screen:

S-28 Projects Home

Tabs:

All

Drafts

Completed

Project cards.

Each card:

Thumbnail

Title

Duration

Date

Status

==================================================

31. PROJECT DETAILS

==================================================

Screen:

S-29 Project Details

Show:

Video

Script

Scenes

Character

Voice

Duration

Actions:

Edit

Duplicate

Publish

Delete

==================================================

32. SCENE MANAGER

==================================================

Screen:

S-30 Scene Manager

List all scenes.

Each scene:

Thumbnail

Title

Duration

Actions:

Edit

Regenerate

Delete

Reorder

==================================================

33. CALENDAR

==================================================

Screen:

S-31 Content Calendar

Tabs:

Drafts

Scheduled

Published

Calendar view.

Show scheduled content.

==================================================

34. SCHEDULE POST

==================================================

Screen:

S-32 Schedule Post

Select:

Platform

Date

Time

Video

Auto-publish toggle.

CTA:

"Schedule Post"

==================================================

35. PUBLISHING STATUS

==================================================

Screen:

S-33 Publishing Status

Timeline:

Preparing

Uploading

Editing

Publishing

Published

Show progress.

==================================================

36. PUBLISHED POST

==================================================

Screen:

S-34 Published Post

Show video.

Show platforms.

Show:

Views

Likes

Comments

Shares

Button:

"View Analytics"

==================================================

37. PUBLISH FLOW

==================================================

Screen:

S-35 Publish

Platforms:

TikTok

Instagram

YouTube

Facebook

Allow multiple selections.

CTA:

"Next"

==================================================

38. AI CAPTION

==================================================

Screen:

S-36 Caption & Hashtags

Automatically generate:

Caption

Hashtags

CTA

Allow editing.

Buttons:

Copy

Regenerate

Edit

==================================================

39. SCHEDULE

==================================================

Screen:

S-37 Schedule

Select:

Date

Time

Platform

CTA:

"Schedule"

==================================================

40. ANALYTICS

==================================================

Screen:

S-38 Analytics Dashboard

Show:

Total Views

Likes

Comments

Shares

Followers Gained

Engagement

Watch Time

Use clean charts with PURPLE only.

==================================================

41. VIDEO ANALYTICS

==================================================

Screen:

S-39 Video Analytics

Individual video analytics.

Show:

Views

Watch time

Retention

Likes

Comments

Shares

==================================================

42. AI INSIGHTS

==================================================

Screen:

S-40 AI Insights

AI-generated insights.

Example:

"Your storytelling videos are performing better."

"Videos with stronger hooks are getting higher retention."

CTA:

"Create More Like This"

==================================================

43. SUBSCRIPTION

==================================================

Screen:

S-41 Pricing Plans

NO FREE PLAN.

Plans:

CREATOR

₦9,900/month

3 minutes

PRO

₦24,900/month

8 minutes

BUSINESS

₦59,900/month

20 minutes

Clearly show:

- Features

- Video allowance

- Current plan

- Upgrade button

Pro should be visually highlighted as the recommended plan.

==================================================

44. CHECKOUT

==================================================

Screen:

S-42 Checkout

Show selected plan.

Price.

Billing:

Monthly

Yearly

Payment method UI.

CTA:

"Pay Now"

==================================================

45. PAYMENT SUCCESS

==================================================

Screen:

S-43 Payment Success

Large success animation.

"Payment successful!"

"You are now on the Pro Plan."

CTA:

"Start Creating"

==================================================

46. SUBSCRIPTION MANAGEMENT

==================================================

Screen:

S-44 Subscription Management

Show:

Current plan

Price

Renewal date

Video allowance

Actions:

Upgrade

Change Plan

Cancel Subscription

Change Billing

==================================================

47. SETTINGS

==================================================

Screen:

S-45 Account Settings

Options:

Profile

Email

Password

Language

Help & Support

==================================================

48. CONNECTED SOCIAL ACCOUNTS

==================================================

Screen:

S-46 Social Accounts

Platforms:

TikTok

Instagram

YouTube

Facebook

Show:

Connected

Not Connected

Buttons:

Connect

Disconnect

==================================================

49. NOTIFICATION SETTINGS

==================================================

Screen:

S-47 Notifications Settings

Toggles:

Video completed

Post published

Scheduled post

Subscription alerts

Usage alerts

Product updates

==================================================

50. SECURITY & PRIVACY

==================================================

Screen:

S-48 Security & Privacy

Options:

Change password

Two-factor authentication

Privacy policy

Terms of service

Manage data

Delete account

==================================================

51. PROFILE

==================================================

Screen:

S-49 Profile Home

Show:

Avatar

Name

Email

Current plan

Video balance

Options:

My Characters

Subscription

Social Accounts

Settings

Help & Support

Sign Out

==================================================

52. HELP & SUPPORT

==================================================

Screen:

S-50 Help & Support

Options:

FAQ

Contact Support

Report a Bug

Tutorials

Send Feedback

==================================================

53. APP INFORMATION

==================================================

Screen:

S-51 About Storypop AI

Show:

Storypop AI logo

"AI UGC Creator App"

Version

Terms

Privacy

Licenses

Contact

==================================================

54. AUTHENTICATION UX

==================================================

Registration and login must feel premium.

Use:

- Smooth transitions

- Input focus animations

- Button loading states

- Error states

- Success states

- Password visibility toggle

- Form validation

- Social login buttons

- Proper keyboard-safe mobile layouts

Do NOT make the authentication screens look like ordinary admin dashboards.

They should feel like a modern consumer AI app.

==================================================

55. EMPTY STATES

==================================================

Create beautiful empty states for:

No projects

No characters

No scheduled posts

No published posts

No notifications

No analytics yet

Each empty state should have:

- Illustration

- Short explanation

- Clear CTA

Example:

"No videos yet"

"Create your first AI-powered UGC video."

Button:

"Create UGC"

==================================================

56. ERROR STATES

==================================================

Create friendly error states for:

Video generation failed

Character generation failed

Social publishing failed

Payment failed

Network error

Session expired

Each should have:

- Clear explanation

- Retry button

- Relevant secondary action

==================================================

57. LOADING STATES

==================================================

Use skeleton loading states throughout the application.

Avoid excessive spinners.

Use:

- Skeleton cards

- Progress bars

- AI generation progress

- Button loading states

==================================================

58. RESPONSIVE DESIGN

==================================================

PRIMARY TARGET:

Mobile app experience.

Optimize for:

390x844

375x812

430x932

Also ensure tablet/desktop responsiveness.

On desktop:

Do not simply stretch the mobile UI.

Create an appropriate centered application layout while maintaining the same information architecture.

==================================================

59. COMPONENT SYSTEM

==================================================

Build reusable components:

Button

Input

TextArea

Select

Toggle

Modal

Bottom Sheet

Card

Video Card

Project Card

Character Card

Voice Card

Template Card

Progress Indicator

Usage Ring

Video Player

Timeline

Toast

Dialog

Tabs

Bottom Navigation

Top Navigation

Empty State

Error State

Skeleton

Use a consistent design system.

==================================================

60. DATA / FRONTEND MOCKING

==================================================

For now, this is FRONTEND ONLY.

Do not require real AI APIs.

Use realistic mock data for:

Users

Projects

Characters

Videos

Analytics

Notifications

Subscriptions

Social accounts

However, structure the code so these can later be replaced with:

Supabase

OpenAI

Runway

ElevenLabs

Paystack

Stripe

Social media APIs

Do NOT expose API keys.

==================================================

61. APP STATES

==================================================

Implement realistic frontend states.

Authentication:

logged out

logged in

loading

error

Projects:

empty

loading

populated

Video:

generating

completed

failed

Character:

generating

completed

failed

Subscription:

active

expired

payment failed

Publishing:

preparing

uploading

publishing

published

failed

==================================================

62. NAVIGATION

==================================================

Use proper client-side routing.

Routes should include:

/splash

/welcome

/register

/login

/verify-email

/home

/notifications

/usage

/create

/create/idea

/create/script

/create/scenes

/create/character

/create/voice

/create/style

/create/settings

/create/generating

/create/result

/editor

/editor/ai

/editor/captions

/editor/audio

/editor/scenes

/editor/export

/projects

/projects/:id

/projects/:id/scenes

/characters

/characters/create

/characters/upload

/characters/style

/characters/generating

/characters/:id

/calendar

/calendar/schedule

/calendar/publishing

/calendar/published

/publish

/publish/caption

/publish/schedule

/analytics

/analytics/:id

/analytics/insights

/subscription

/subscription/checkout

/subscription/success

/subscription/manage

/subscription/credits

/profile

/settings

/settings/social

/settings/notifications

/settings/security

/help

/about

==================================================

63. MOBILE BOTTOM NAVIGATION

==================================================

Authenticated app footer:

HOME

PROJECTS

+ CREATE

CALENDAR

PROFILE

Create must be the prominent central button.

Use purple for active state.

Do not introduce blue into the bottom navigation.

==================================================

64. UX PRINCIPLE

==================================================

The most important action in Storypop AI is:

CREATE UGC.

The user should always be able to easily find:

"+ Create UGC"

The core journey should feel like:

IDEA

↓

SCRIPT

↓

SCENES

↓

CHARACTER

↓

VOICE

↓

STYLE

↓

GENERATE

↓

EDIT

↓

PUBLISH

↓

ANALYZE

Make this flow extremely simple.

==================================================

65. AI CHARACTER EXPERIENCE

==================================================

The signature feature is:

User uploads a full photo of themselves

↓

Storypop AI creates an animated representation

↓

User saves the character

↓

Character can be reused in future videos

The UI should make this feature feel special.

Use labels such as:

"Your AI Character"

"Create your animated identity"

"Use Character"

"Create New Character"

==================================================

66. VIDEO CREATION EXPERIENCE

==================================================

The user should be able to create a video without knowing how to use AI.

Example:

User types:

"Create a funny 30-second video promoting my sneaker business."

Storypop AI should visually show:

Idea

↓

Script

↓

Scenes

↓

Character

↓

Voice

↓

Video

↓

Edit

↓

Publish

==================================================

67. IMPORTANT DESIGN RULES

==================================================

1. PURPLE IS THE ONLY BRAND ACCENT.

2. Do not mix blue, green, orange, red or other accent colours into the UI.

3. Keep the UI clean.

4. Make buttons obvious.

5. Make Create UGC the primary action.

6. Use realistic mock content rather than lorem ipsum.

7. Use proper mobile spacing.

8. Do not make text too small.

9. Make cards visually distinct.

10. Use smooth transitions.

11. Keep the application consistent across every screen.

12. Maintain the same purple design system throughout.

13. Do not create a landing page instead of the application.

14. This must feel like a real AI creator mobile app.

15. All screens must be connected through working frontend navigation.

==================================================

68. FINAL DELIVERABLE

==================================================

Build the complete Storypop AI frontend with all screens above.

The result should look like a real premium AI startup product ready for user testing.

Prioritize:

1. Mobile UX

2. Visual quality

3. Consistency

4. Clear navigation

5. AI creation flow

6. Character creation

7. Video editing

8. Publishing

9. Subscription

10. Analytics

Use mock data where backend functionality is not yet connected.

Make the application feel complete even though the backend/API integrations will be added later.

Do not leave major screens as blank placeholders.

Every screen should have:

- Proper heading

- Proper content

- Relevant UI

- CTA

- Navigation

- Loading/empty/error states where applicable

Build Storypop AI as a complete, polished frontend application.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/3b29c3c4-a39b-4d59-b827-90a0b2463348).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
