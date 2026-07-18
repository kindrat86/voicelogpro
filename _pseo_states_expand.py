#!/usr/bin/env python3
"""
Generate 43 missing state lien law pages for voicelogpro.com
Template: public/states/california-lien-law/index.html
Output: public/states/{state-slug}-lien-law/index.html
"""

import os, json

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_DIR = os.path.join(BASE_DIR, "public", "states")

now = "2026-07-18"

# ─── State data ──────────────────────────────────────────────────────────────
# Each entry: (slug, name_short, state_name, notice_rule, notice_desc,
#              file_deadline, file_desc, enforcement, enforcement_desc,
#              faq_q1, faq_a1, faq_q2, faq_a2, faq_q3, faq_a3,
#              intro_extra)
# All data researched from state mechanic's lien statutes.

STATES = [
    # ─── ALABAMA ───
    ("alabama", "Alabama", "Alabama",
     "no preliminary notice required", "No preliminary notice is required for subcontractors on private projects in Alabama. However, you must serve a copy of the lien on the owner after filing.",
     "120 days from last furnishing", "120 days from last furnishing of labor or materials",
     "6 months", "6 months from filing",
     "Do subcontractors need to send a preliminary notice in Alabama?", "No. Alabama does not require subcontractors to send a preliminary notice to preserve lien rights on private projects. This makes Alabama more contractor-friendly than many other states, but it also means you must maintain immaculate records of when work was performed.",
     "How long does a mechanics lien last in Alabama?", "After filing, you have 6 months to initiate a foreclosure lawsuit. If you do not file suit within that window, the lien expires and becomes unenforceable.",
     "Can a subcontractor file a lien for materials but not labor in Alabama?", "Yes, Alabama lien law covers both labor and material suppliers. Subcontractors who supply materials only are still protected, as long as the materials were incorporated into the improvement.",
     "Subcontractors in Alabama benefit from a relatively straightforward lien process with no preliminary notice requirement, but the 6-month enforcement deadline is shorter than in many states. Consistent daily reporting is essential to prove your work dates."),

    # ─── ALASKA ───
    ("alaska", "Alaska", "Alaska",
     "no preliminary notice required", "Alaska does not require subcontractors to send preliminary notice for private projects. However, the lien must be recorded within strict time limits.",
     "120 days from last work", "120 days from last furnishing of labor or materials",
     "2 years", "2 years from recording the lien",
     "Do subcontractors need preliminary notice in Alaska?", "No, Alaska does not require subcontractors to serve a preliminary notice on the owner or general contractor before filing a mechanics lien. But you should still document all communications and deliveries.",
     "How long do I have to file a mechanics lien in Alaska?", "You must file within 120 days of your last furnishing of labor, materials, or equipment. This deadline runs from the last date you performed work or supplied materials to the project.",
     "Can a material supplier file a lien in Alaska?", "Yes. Alaska's lien statute protects anyone who furnishes labor, materials, or equipment for an improvement, including material suppliers and subcontractors at any tier.",
     "Alaska's 120-day filing window gives subcontractors a reasonable period to prepare and record a lien. With VoiceLogPro, your daily reports automatically timestamp every work date, providing the evidence you need to establish the last-furnishing date."),

    # ─── ARIZONA ───
    ("arizona", "Arizona", "Arizona",
     "20-day preliminary notice", "Arizona requires subcontractors to serve a Preliminary 20-Day Notice to the owner and prime contractor within 20 days of first furnishing labor or materials. Failure is fatal to lien rights.",
     "120 days from last work", "120 days from last furnishing of labor or materials",
     "6 months", "6 months from recording the lien",
     "Do subcontractors need preliminary notice in Arizona?", "Yes. Subcontractors and material suppliers must serve a Preliminary 20-Day Notice within 20 days of first providing labor or materials. Late notice is limited to lien value for work done in the 20 days before the notice.",
     "What happens if I miss the 20-day notice deadline in Arizona?", "You can still serve a late notice, but your lien will only cover work performed in the 20 days before the notice date — not all work from the start of the project. This makes timely notice critical.",
     "How long does a mechanics lien last in Arizona?", "After recording the lien, you have 6 months to foreclose. If you don't file suit within 6 months, the lien expires. Daily reports help you prove the work dates and amounts claimed.",
     "Arizona's 20-day preliminary notice requirement is strict. VoiceLogPro's automatic timestamping ensures you have a verifiable record of when notices were delivered, protecting your full lien claim value."),

    # ─── ARKANSAS ───
    ("arkansas", "Arkansas", "Arkansas",
     "no preliminary notice required", "Arkansas does not require subcontractors to give preliminary notice for private projects. However, a Notice of Intent to Lien may be required before filing.",
     "120 days from last work", "120 days from last furnishing of labor or materials (or substantial completion)",
     "90 days", "90 days from filing the lien",
     "Do subcontractors need preliminary notice in Arkansas?", "No, Arkansas does not have a preliminary notice requirement for private construction projects. However, some contractors choose to send a Notice of Intent to Lien before filing as a courtesy and to prompt payment.",
     "How long do I have to file a mechanics lien in Arkansas?", "You must file your lien within 120 days of the last furnishing of labor or materials. For public projects, different deadlines apply under the Arkansas Little Miller Act.",
     "What is the enforcement period for an Arkansas mechanics lien?", "Once filed, you have only 90 days to initiate a foreclosure lawsuit. This is one of the shortest enforcement windows in the country, so prompt action is essential after filing.",
     "Arkansas has one of the shortest enforcement periods at just 90 days. VoiceLogPro's timestamped daily reports give you the organized documentation you need to act fast after filing."),

    # ─── CONNECTICUT ───
    ("connecticut", "Connecticut", "Connecticut",
     "no preliminary notice required", "Connecticut does not require subcontractors to serve preliminary notice for private projects. However, a Certificate of Mechanic's Lien must be recorded within strict deadlines.",
     "90 days from last work", "90 days from last furnishing of labor or materials (or cessation of work)",
     "1 year", "1 year from recording the lien (extendable by court order up to 2 years)",
     "Do I need a preliminary notice to file a lien in Connecticut?", "No. Connecticut is one of the states that does not require a preliminary notice. However, you must strictly follow the recording and service requirements after filing.",
     "How long do I have to file a Connecticut mechanics lien?", "Subcontractors must file within 90 days after the last day of work or materials provided. This deadline is absolute and runs from the last furnishing, not project completion.",
     "Can I file a mechanics lien in Connecticut without a written contract?", "Yes, Connecticut lien law covers both written and oral contracts. However, proving the scope and value of work without a written contract makes daily documentation even more critical.",
     "Connecticut's 90-day filing window requires fast action after your last work day. VoiceLogPro helps you track every day on site so you never miss the filing deadline."),

    # ─── DELAWARE ───
    ("delaware", "Delaware", "Delaware",
     "no preliminary notice required", "Delaware does not require subcontractors to send preliminary notice. The lien must be filed and served within strict deadlines.",
     "90 days from last work", "90 days from last furnishing (or 90 days after project completion if continuing work)",
     "1 year", "1 year from filing the lien",
     "Does Delaware require preliminary notice for subcontractors?", "No, Delaware does not have a preliminary notice statute. Subcontractors can file a mechanics lien directly, but must serve a copy on the owner within the filing period.",
     "How long do I have to file a mechanics lien in Delaware?", "You must file within 90 days of your last furnishing of labor or materials. If your work was continuing, the deadline runs from the last day of work.",
     "Can a material supplier file a lien in Delaware?", "Yes. Delaware's lien law covers anyone who performs labor or furnishes materials for an improvement, including subcontractors and material suppliers at any tier.",
     "Delaware's straightforward lien process has no preliminary notice trap, but the 90-day filing deadline is tight. VoiceLogPro's daily log ensures you always know your last work date."),

    # ─── HAWAII ───
    ("hawaii", "Hawaii", "Hawaii",
     "20-day preliminary notice", "Hawaii requires subcontractors to serve a Preliminary Notice of Mechanic's Lien within 20 days of first furnishing labor or materials. This is required to fully preserve lien rights.",
     "90 days from last work", "90 days from last furnishing of labor or materials",
     "6 months", "6 months from recording the lien (or 6 months after completion of the contract)",
     "Do subcontractors need a preliminary notice in Hawaii?", "Yes. Hawaii law requires subcontractors to serve a preliminary notice within 20 days of first providing labor or materials. Late notice limits recovery to work done after service.",
     "What is the lien filing deadline in Hawaii?", "You must file your mechanics lien within 90 days after the last furnishing of labor or materials. This deadline is strictly enforced by Hawaii courts.",
     "Can an oral subcontractor file a mechanic's lien in Hawaii?", "Yes, Hawaii's lien statute applies to both written and oral contracts. However, proving the terms of an oral agreement requires strong documentation of the work performed.",
     "Hawaii's 20-day preliminary notice rule is similar to California and Arizona. VoiceLogPro's timestamped voice reports create an indisputable record of when you first started work on the job."),

    # ─── IDAHO ───
    ("idaho", "Idaho", "Idaho",
     "no preliminary notice required", "Idaho does not require preliminary notice for subcontractors on private projects. However, a notice of intent to file a lien may be required.",
     "90 days from last work", "90 days from last furnishing of labor or materials",
     "6 months", "6 months from recording the lien",
     "Is preliminary notice required for Idaho mechanics liens?", "No. Idaho does not have a preliminary notice requirement. However, subcontractors should be aware that a notice of intent to file a lien may be required before recording.",
     "How long do I have to file in Idaho?", "You have 90 days from the last furnishing of labor or materials to file your lien. This is a firm deadline with no extensions available.",
     "How long does a mechanics lien last in Idaho?", "Once filed, you have 6 months to initiate a foreclosure action. If you fail to file suit within 6 months, the lien expires automatically.",
     "Idaho's lien process is relatively simple. VoiceLogPro helps you build the documentation you need to prove your work dates and amounts in any lien dispute."),

    # ─── INDIANA ───
    ("indiana", "Indiana", "Indiana",
     "no preliminary notice required", "Indiana does not require subcontractors to send preliminary notice for private projects. However, a Notice of Intent to Hold Lien must be served before filing.",
     "60 days from last work", "60 days from last furnishing of labor or materials (90 days for single-family residences)",
     "1 year", "1 year from filing the lien",
     "Do subcontractors need preliminary notice in Indiana?", "No, Indiana does not require a preliminary notice. However, a Notice of Intent to Hold Lien must be served on the owner at least 10 days before recording the lien statement.",
     "What is the filing deadline in Indiana?", "Subcontractors must file within 60 days from the last date of furnishing labor or materials. For single-family residential projects, the deadline is 90 days.",
     "Can a material supplier file a lien in Indiana?", "Yes, Indiana's lien law explicitly covers material suppliers and subcontractors who provide labor, materials, machinery, or equipment for the improvement.",
     "Indiana's 60-day filing window is one of the tightest in the country. VoiceLogPro's daily reports give you immediate access to your last work dates so you never miss the deadline."),

    # ─── IOWA ───
    ("iowa", "Iowa", "Iowa",
     "no preliminary notice required", "Iowa does not require preliminary notice. However, a written notice of intent to file a mechanic's lien must be served on the owner 10 days before filing.",
     "90 days from last work", "90 days from last furnishing of labor or materials",
     "1 year", "1 year (for public improvements) or 2 years (for private improvements) from filing",
     "Is Iowa a preliminary notice state?", "No, Iowa does not require preliminary notice. However, subcontractors must serve a written notice of intent to file a mechanic's lien at least 10 days before recording the lien.",
     "How long do I have to file a mechanics lien in Iowa?", "You must file within 90 days from the last date of furnishing labor or materials. This deadline runs from your last day on the job.",
     "How long does an Iowa mechanics lien last?", "Once filed, you have 2 years to foreclose on a private project or 1 year on a public improvement. This is a generous window compared to many states.",
     "Iowa's 10-day pre-lien notice rule is a unique requirement. VoiceLogPro ensures you have the records to prove exactly when work was performed and when notices were served."),

    # ─── KANSAS ───
    ("kansas", "Kansas", "Kansas",
     "no preliminary notice required", "Kansas does not require subcontractors to provide preliminary notice for private projects. However, the lien must be filed within deadlines.",
     "4 months from last work", "4 months from last furnishing of labor or materials",
     "1 year", "1 year from filing the lien",
     "Does Kansas require preliminary notice?", "No, Kansas does not require preliminary notice for subcontractors on private construction projects. The lien can be filed directly within the statutory period.",
     "How long do I have to file in Kansas?", "Subcontractors have 4 months from the last date of furnishing labor or materials to file their mechanics lien. This is a mid-range deadline compared to other states.",
     "Can a subcontractor without a written contract file a lien in Kansas?", "Yes, Kansas lien law covers oral contracts. However, proving the scope and value of work without written documentation requires strong records of daily work performed.",
     "Kansas gives subcontractors a reasonable 4-month filing window. VoiceLogPro's daily reports create the documentation trail you need to support your lien claim."),

    # ─── KENTUCKY ───
    ("kentucky", "Kentucky", "Kentucky",
     "no preliminary notice required", "Kentucky does not require preliminary notice. However, a notice of filing must be given to the owner within the lien filing period.",
     "6 months from last work", "6 months from last furnishing of labor or materials",
     "1 year", "1 year from filing the lien",
     "Is preliminary notice needed in Kentucky?", "No. Kentucky does not have a preliminary notice statute for private projects. Subcontractors can file a mechanic's lien directly, but must serve the owner after recording.",
     "What is the lien filing deadline in Kentucky?", "Kentucky subcontractors have 6 months from the last date of furnishing labor or materials to file. This is one of the more generous filing windows in the country.",
     "Does Kentucky require an attorney to file a mechanics lien?", "While not legally required, Kentucky lien law has many procedural requirements. Most subcontractors work with an attorney, but the evidence — daily reports — is entirely your responsibility.",
     "Kentucky's 6-month filing window gives you breathing room. VoiceLogPro ensures every work day is documented with timestamped, weather-verified PDF reports."),

    # ─── LOUISIANA ───
    ("louisiana", "Louisiana", "Louisiana",
     "30-day notice of nonpayment (sworn statement)", "Louisiana requires subcontractors with no direct contract with the owner to file a statement of claim or sworn statement within 30 days of the owner filing a Notice of Contract or within 30 days of receiving the Notice of Contract.",
     "60 days from recording of Notice of Termination", "60 days from recording of Notice of Termination of the contract (or 30 days from Substantial Completion/Ownership if no Notice of Termination)",
     "1 year", "1 year from filing of lien",
     "Does Louisiana require preliminary notice?", "Louisiana's system is unique. Subcontractors who do not have a direct contract with the owner must file a Sworn Statement within 30 days of the Notice of Contract to preserve their lien rights.",
     "What is the Louisiana lien filing deadline?", "The deadline depends on when the Notice of Contract is recorded. Generally, you must file within 60 days from the recording of the Notice of Termination or 30 days from substantial completion.",
     "Can subcontractors file a lien in Louisiana for work on an owner-occupied home?", "Yes, but the rules are stricter for owner-occupied residences with a value of $50,000 or more. Compliance with the Louisiana Private Works Act is complex and consultation with counsel is recommended.",
     "Louisiana has one of the most complex lien systems in the country, governed by the Louisiana Private Works Act. VoiceLogPro's timestamped daily logs are critical for proving work dates in any Louisiana lien dispute."),

    # ─── MAINE ───
    ("maine", "Maine", "Maine",
     "no preliminary notice required", "Maine does not require preliminary notice. However, a Notice of Claim must be filed within strict deadlines.",
     "90 days from last work", "90 days from last furnishing of labor or materials (or 90 days from completion of contract)",
     "120 days", "120 days from recording the lien",
     "Does Maine require subcontractors to send preliminary notice?", "No. Maine does not have a preliminary notice requirement. Subcontractors can file a lien directly, but must do so within 90 days of the last work.",
     "How long do I have to file a Maine mechanics lien?", "You have 90 days from your last day of furnishing labor or materials to file the lien in the county registry. This deadline is strictly enforced.",
     "How long is a Maine mechanics lien valid?", "After filing, you have 120 days to initiate a foreclosure action. This is a relatively short enforcement window, so you must act promptly after recording.",
     "Maine's 120-day enforcement period is short. VoiceLogPro helps you stay organized so you can act quickly after filing your lien."),

    # ─── MARYLAND ───
    ("maryland", "Maryland", "Maryland",
     "preliminary notice required within 60 days", "Maryland requires subcontractors with no direct contract with the owner to serve a notice of their intention to claim a lien within 60 days of first furnishing labor or materials.",
     "180 days from last work", "180 days from last furnishing of labor or materials",
     "1 year", "1 year from recording the lien (but must file within 180 days of last furnishing)",
     "Do subcontractors need preliminary notice in Maryland?", "Yes. Subcontractors who do not have a direct contract with the property owner must serve written notice within 60 days of first providing labor or materials. This is a strict requirement.",
     "What is the filing deadline for a Maryland mechanics lien?", "Subcontractors must file the lien within 180 days from the last furnishing of labor or materials. Note: the notice must be served within 60 days of starting work, and the lien filed within 180 days of finishing.",
     "Can a material supplier file a lien in Maryland?", "Yes, material suppliers are protected under Maryland lien law as long as they serve proper notice and comply with all deadlines. The same 60-day notice and 180-day filing rules apply.",
     "Maryland is one of the few eastern states requiring preliminary notice. VoiceLogPro's automatic recordkeeping ensures you have proof of when notice was served and when work began."),

    # ─── MASSACHUSETTS ───
    ("massachusetts", "Massachusetts", "Massachusetts",
     "Notice of Contract required within 90 days", "Massachusetts requires subcontractors to file a Notice of Contract in the registry of deeds within 90 days of performing work or furnishing materials to preserve lien rights.",
     "90 days from last work (file in registry)", "90 days from last furnishing (to file Notice of Contract), then file Statement of Account within 30-60 days after filing suit",
     "60 days", "60 days from recording the Statement of Account (to file suit)",
     "Does Massachusetts require preliminary notice?", "Yes. Massachusetts has a unique two-step process: subcontractors must file a Notice of Contract in the registry of deeds within 90 days of first furnishing labor or materials, then later file a Statement of Account.",
     "How long do I have to file a lien in Massachusetts?", "First, file the Notice of Contract within 90 days of last furnishing. Then, within 30-60 days after recording, file the Statement of Account. The deadlines are strict and sequential.",
     "What happens if I miss the Massachusetts Notice of Contract deadline?", "Missing the 90-day Notice of Contract deadline is fatal to your lien claim. Massachusetts courts strictly enforce this requirement — there is no cure for a late filing.",
     "Massachusetts has one of the most complex lien filing processes in the country with its two-step Notice of Contract and Statement of Account system. VoiceLogPro helps you track deadlines with timestamped daily reports."),

    # ─── MICHIGAN ───
    ("michigan", "Michigan", "Michigan",
     "notice required for non-physical improvements (design)", "Michigan does not require preliminary notice for most subcontractors providing labor. However, those providing design services or off-site materials must send a notice.",
     "90 days from last work", "90 days from last furnishing of labor or materials",
     "1 year", "1 year from recording the lien",
     "Do Michigan subcontractors need preliminary notice?", "Not for most subcontractors performing on-site labor. However, if you are providing design services, engineering, or off-site materials, a written notice must be sent within 30 days of first furnishing.",
     "What is the Michigan lien filing deadline?", "You must file within 90 days of your last furnishing of labor or materials. This is counted from the last day you actually performed work on the project.",
     "Can a subcontractor file a lien without a contract in Michigan?", "Yes, Michigan lien law covers both express and implied contracts. However, proving the value of work without a written contract makes daily documentation essential.",
     "Michigan's 90-day filing window is standard. VoiceLogPro's voice-to-PDF daily reports ensure you have court-ready documentation of every work day on the job."),

    # ─── MINNESOTA ───
    ("minnesota", "Minnesota", "Minnesota",
     "preliminary notice required within 45 days", "Minnesota requires subcontractors to serve a Preliminary Notice within 45 days of first furnishing labor or materials. Failure to serve limits the lien claim.",
     "120 days from last work", "120 days from last furnishing of labor or materials",
     "1 year", "1 year from recording the lien",
     "Do subcontractors need preliminary notice in Minnesota?", "Yes. Minnesota requires subcontractors who do not have a direct contract with the owner to serve a Preliminary Notice within 45 days of first providing labor or materials. Late notice limits recovery.",
     "What is the lien filing deadline in Minnesota?", "Subcontractors have 120 days from the last furnishing of labor or materials to file their mechanics lien. This is a generous window compared to neighboring states.",
     "Can a material supplier file a lien in Minnesota?", "Yes, Minnesota lien law covers material suppliers and subcontractors equally. The same 45-day notice and 120-day filing rules apply to anyone providing materials to a project.",
     "Minnesota's 45-day preliminary notice deadline is often missed by subcontractors unfamiliar with the requirement. VoiceLogPro's automated timestamping keeps you on track."),

    # ─── MISSISSIPPI ───
    ("mississippi", "Mississippi", "Mississippi",
     "no preliminary notice required", "Mississippi does not require subcontractors to send preliminary notice for private projects.",
     "90 days from last work", "90 days from last date of furnishing labor or materials",
     "1 year", "1 year from the date the lien is recorded",
     "Does Mississippi require preliminary notice?", "No. Mississippi is not a preliminary notice state. However, the lien must be filed within 90 days of the last furnishing, and a copy must be served on the owner.",
     "How long do I have to file in Mississippi?", "Subcontractors must file their lien within 90 days of the last day they furnished labor, materials, or equipment to the project.",
     "How long does a Mississippi mechanics lien last?", "Once filed, you have 1 year to initiate foreclosure proceedings. If you do not file suit within 1 year, the lien expires.",
     "Mississippi's 90-day filing window is straightforward. VoiceLogPro helps you build the documentation you need to prove your work dates and amounts in any lien dispute."),

    # ─── MISSOURI ───
    ("missouri", "Missouri", "Missouri",
     "no preliminary notice required", "Missouri does not require subcontractors to send preliminary notice. However, a Notice of Intent to File a Lien must be served 10 days before filing.",
     "6 months from last work", "6 months from last furnishing of labor or materials",
     "1 year", "1 year from filing the lien",
     "Is there a preliminary notice requirement in Missouri?", "No, Missouri does not require preliminary notice. However, you must serve a Notice of Intent to File a Lien on the owner at least 10 days before recording the lien.",
     "What is the filing deadline in Missouri?", "You have 6 months from your last date of furnishing labor or materials to file your mechanics lien. This is one of the more generous windows in the country.",
     "Can an oral subcontractor file a lien in Missouri?", "Yes, Missouri lien law covers both written and oral contracts. However, proving the scope of work without a written contract requires excellent daily records.",
     "Missouri's 6-month filing window gives you time, but the 10-day pre-lien notice is easy to forget. VoiceLogPro keeps you organized from day one."),

    # ─── MONTANA ───
    ("montana", "Montana", "Montana",
     "no preliminary notice required", "Montana does not require preliminary notice for subcontractors on private projects.",
     "90 days from last work", "90 days from last furnishing of labor or materials",
     "1 year", "1 year from filing the lien",
     "Does Montana require preliminary notice?", "No. Montana does not have a preliminary notice statute. Subcontractors can file a mechanics lien directly within the statutory period.",
     "How long do I have to file a Montana mechanics lien?", "You must file within 90 days from the last day of furnishing labor or materials. This deadline runs from your last day on the job site.",
     "How long does a Montana mechanics lien last?", "After filing, you have 1 year to initiate a foreclosure action. This gives you time, but you should still move promptly.",
     "Montana's lien rules are straightforward. VoiceLogPro ensures you have the documentation to prove every work day and material delivery."),

    # ─── NEBRASKA ───
    ("nebraska", "Nebraska", "Nebraska",
     "no preliminary notice required", "Nebraska does not require preliminary notice. However, a notice of the lien must be served on the owner within the filing period.",
     "120 days from last work", "120 days from last furnishing of labor or materials",
     "2 years", "2 years from filing the lien",
     "Does Nebraska require preliminary notice?", "No. Nebraska is a no-notice state for private construction projects. Subcontractors can file a lien directly.",
     "What is the Nebraska lien filing deadline?", "You have 120 days from the last date of furnishing labor or materials to file your mechanics lien. This is a standard mid-range deadline.",
     "How long does a Nebraska mechanics lien last?", "Nebraska provides a generous 2-year enforcement window from the date of filing the lien. This is one of the longest windows in the country.",
     "Nebraska's 120-day filing deadline and 2-year enforcement period favor subcontractors. VoiceLogPro documents every work day so your lien claim is supported by solid evidence."),

    # ─── NEVADA ───
    ("nevada", "Nevada", "Nevada",
     "preliminary notice required within 30 days", "Nevada requires subcontractors to serve a Notice of Intent to Lien within 30 days of first furnishing labor or materials. This is a strict requirement.",
     "90 days from last work", "90 days from last furnishing of labor or materials",
     "1 year", "1 year from filing the lien (or 60 days for homeowners)",
     "Do Nevada subcontractors need preliminary notice?", "Yes. Nevada requires subcontractors to serve a Notice of Intent to Lien within 30 days of first providing labor or materials. Failure to do so forfeits lien rights.",
     "What is the lien filing deadline in Nevada?", "You must file your mechanics lien within 90 days of the last date you furnished labor or materials to the project. The 90-day clock starts on your last day of work.",
     "What is the enforcement period in Nevada?", "After filing, you have 1 year to foreclose on the lien. For owner-occupied residential projects, the deadline is reduced to 60 days after recording.",
     "Nevada's 30-day notice requirement is strict and unforgiving. VoiceLogPro's timestamped reports help you prove when notice was served and when work began on the project."),

    # ─── NEW HAMPSHIRE ───
    ("new-hampshire", "New Hampshire", "New Hampshire",
     "no preliminary notice required", "New Hampshire does not require preliminary notice for subcontractors on private projects.",
     "120 days from last work", "120 days from last furnishing of labor or materials",
     "1 year", "1 year from filing the lien",
     "Does New Hampshire require preliminary notice for subcontractors?", "No. New Hampshire does not have a preliminary notice requirement. However, the lien must be filed within the statutory period.",
     "How long do I have to file a New Hampshire mechanics lien?", "You have 120 days from the last date of furnishing labor or materials to file. This deadline runs from your last day on the job.",
     "How long does a New Hampshire mechanics lien last?", "Once filed, you have 1 year to initiate a foreclosure action. If you fail to file within 1 year, the lien expires.",
     "New Hampshire's straightforward lien process has no notice traps. VoiceLogPro's daily reports ensure your documentation is always ready when you need to file."),

    # ─── NEW JERSEY ───
    ("new-jersey", "New Jersey", "New Jersey",
     "no preliminary notice required", "New Jersey does not require preliminary notice for subcontractors. However, a Notice of Unpaid Balance (NUB) must be filed to protect future lien rights.",
     "90 days from last work", "90 days from last furnishing of labor or materials",
     "1 year", "1 year from filing the lien",
     "Does New Jersey require preliminary notice?", "No, New Jersey does not require a preliminary notice. However, to be fully protected, subcontractors should file a Notice of Unpaid Balance and Right to File Lien.",
     "What is the lien filing deadline in New Jersey?", "You must file your mechanics lien within 90 days of the last date of furnishing labor or materials. This is a strict statutory deadline.",
     "Can a subcontractor file a lien without a contract in New Jersey?", "Yes, New Jersey lien law covers work performed under both written and oral contracts. However, proving the value without a written agreement requires strong daily documentation.",
     "New Jersey's Notice of Unpaid Balance is an extra step many subcontractors miss. VoiceLogPro ensures your records are organized so you can comply with every filing requirement."),

    # ─── NEW MEXICO ───
    ("new-mexico", "New Mexico", "New Mexico",
     "no preliminary notice required", "New Mexico does not require preliminary notice for subcontractors on private projects.",
     "120 days from last work", "120 days from last furnishing of labor or materials",
     "2 years", "2 years from filing the lien",
     "Does New Mexico require preliminary notice?", "No. New Mexico is not a preliminary notice state. Subcontractors can file a mechanics lien directly within the statutory period.",
     "What is the lien filing deadline in New Mexico?", "You must file within 120 days from the last date of furnishing labor or materials. This deadline is strictly enforced.",
     "How long does a New Mexico mechanics lien last?", "New Mexico provides a 2-year enforcement window from the date of filing. This is among the longest in the country, giving you time to negotiate before filing suit.",
     "New Mexico's 120-day filing window and 2-year enforcement period give subcontractors room to maneuver. VoiceLogPro keeps your documentation organized from day one."),

    # ─── NORTH DAKOTA ───
    ("north-dakota", "North Dakota", "North Dakota",
     "no preliminary notice required", "North Dakota does not require preliminary notice for subcontractors on private projects.",
     "90 days from last work", "90 days from last furnishing of labor or materials",
     "1 year", "1 year from filing the lien",
     "Does North Dakota require preliminary notice?", "No. North Dakota does not have a preliminary notice requirement. Subcontractors can file directly within the 90-day window.",
     "What is the filing deadline in North Dakota?", "You must file your mechanics lien within 90 days from the last date labor or materials were furnished to the project.",
     "How long does a North Dakota mechanics lien last?", "After filing, you have 1 year to initiate a foreclosure action. If no suit is filed within 1 year, the lien expires.",
     "North Dakota's 90-day filing window is standard but strict. VoiceLogPro's voice-to-PDF daily reports give you instant access to your work history."),

    # ─── OKLAHOMA ───
    ("oklahoma", "Oklahoma", "Oklahoma",
     "no preliminary notice required", "Oklahoma does not require preliminary notice for subcontractors. However, a pre-lien notice may be required for certain material suppliers.",
     "4 months from last work", "4 months from last furnishing of labor or materials",
     "1 year", "1 year from filing the lien",
     "Is preliminary notice required in Oklahoma?", "No, Oklahoma does not have a general preliminary notice requirement. However, certain material suppliers who do not have a contract with the owner may need additional steps.",
     "How long do I have to file in Oklahoma?", "Subcontractors have 4 months from the last date of furnishing labor or materials to file their lien. This is a mid-range deadline.",
     "How long does an Oklahoma mechanics lien last?", "Once filed, the lien is valid for 1 year. You must initiate foreclosure within that year or the lien expires.",
     "Oklahoma gives subcontractors 4 months to file and 1 year to enforce. VoiceLogPro's daily reports prove every work date with court-admissible PDFs."),

    # ─── OREGON ───
    ("oregon", "Oregon", "Oregon",
     "preliminary notice required within 8 days", "Oregon requires subcontractors to serve a Notice of Right to Lien within 8 days of first furnishing labor or materials. This is one of the shortest notice windows in the country.",
     "75 days from last work", "75 days from last furnishing of labor or materials",
     "1 year", "1 year from recording the lien",
     "Do Oregon subcontractors need preliminary notice?", "Yes. Oregon requires subcontractors to serve a Notice of Right to Lien within 8 days of first providing labor or materials. This is extremely strict and easy to miss.",
     "What is the Oregon lien filing deadline?", "You must file your mechanics lien within 75 days of the last date you furnished labor or materials. This is one of the shortest filing windows in the country.",
     "What happens if I miss the 8-day notice in Oregon?", "Missing the 8-day notice means you lose your lien rights entirely. There is no late notice cure. Oregon's deadline is the strictest in the nation for preliminary notice.",
     "Oregon has the shortest preliminary notice window in the country at just 8 days. VoiceLogPro's automatic timestamping and reminders help you comply with this unforgiving deadline."),

    # ─── PENNSYLVANIA ───
    ("pennsylvania", "Pennsylvania", "Pennsylvania",
     "no preliminary notice required for subcontractors with direct contract", "Pennsylvania does not require a preliminary notice for subcontractors with a direct contract with the owner. Sub-subcontractors must serve a Notice of Furnishing within 45 days.",
     "6 months from last work", "6 months from last furnishing of labor or materials",
     "1 year", "1 year from filing the lien (or 6 months for residential projects)",
     "Do Pennsylvania subcontractors need preliminary notice?", "It depends on your tier. First-tier subcontractors with a direct contract with the owner do not need notice. Lower-tier subcontractors must serve a Notice of Furnishing within 45 days.",
     "What is the filing deadline in Pennsylvania?", "You have 6 months from the last date of furnishing labor or materials to file your mechanics lien. This is a generous window compared to neighboring states.",
     "How long does a Pennsylvania mechanics lien last?", "After filing, you have 1 year to foreclose on a commercial project, or 6 months on a residential project. The shorter residential window catches many subcontractors off guard.",
     "Pennsylvania's tier-based notice rules can be confusing. VoiceLogPro helps you document your position in the contracting chain and track all notice deadlines."),

    # ─── RHODE ISLAND ───
    ("rhode-island", "Rhode Island", "Rhode Island",
     "no preliminary notice required", "Rhode Island does not require preliminary notice for subcontractors on private projects.",
     "200 days from last work", "200 days from last furnishing of labor or materials",
     "1 year", "1 year from filing the lien",
     "Is preliminary notice required in Rhode Island?", "No, Rhode Island does not require preliminary notice. However, subcontractors must file within the 200-day window and serve a copy on the owner.",
     "What is the filing deadline in Rhode Island?", "Rhode Island provides 200 days from the last furnishing of labor or materials — one of the longest filing windows in the country.",
     "How long does a Rhode Island mechanics lien last?", "Once filed, you have 1 year to foreclose. If you do not file suit within 1 year, the lien expires.",
     "Rhode Island's 200-day window is exceptionally generous. VoiceLogPro helps you track every work day so you know exactly when the clock starts."),

    # ─── SOUTH CAROLINA ───
    ("south-carolina", "South Carolina", "South Carolina",
     "no preliminary notice required", "South Carolina does not require preliminary notice for subcontractors. However, a notice of the lien filing must be given to the owner.",
     "90 days from last work", "90 days from last furnishing of labor or materials",
     "1 year", "1 year from filing the lien",
     "Does South Carolina require preliminary notice?", "No. South Carolina is not a preliminary notice state. Subcontractors can file a mechanics lien directly within the 90-day period.",
     "What is the filing deadline in South Carolina?", "Subcontractors must file their lien within 90 days from the last date of furnishing labor or materials to the project.",
     "How long does a South Carolina mechanics lien last?", "After filing, you have 1 year to foreclose. If no lawsuit is filed within 1 year, the lien ceases to be effective.",
     "South Carolina's straightforward lien process gives you 90 days to file. VoiceLogPro's daily reports provide the proof of work dates you need."),

    # ─── SOUTH DAKOTA ───
    ("south-dakota", "South Dakota", "South Dakota",
     "no preliminary notice required", "South Dakota does not require preliminary notice for subcontractors on private projects.",
     "120 days from last work", "120 days from last furnishing of labor or materials",
     "2 years", "2 years from filing the lien",
     "Does South Dakota require preliminary notice?", "No. South Dakota does not have a preliminary notice requirement. Subcontractors can file directly within the statutory period.",
     "What is the South Dakota lien filing deadline?", "You must file within 120 days from the last date of furnishing labor or materials to the project.",
     "How long does a South Dakota mechanics lien last?", "You have 2 years from the date of filing to initiate a foreclosure action — one of the longest windows in the country.",
     "South Dakota's 120-day filing deadline and 2-year enforcement period are generous. VoiceLogPro ensures your documentation is always court-ready."),

    # ─── TENNESSEE ───
    ("tennessee", "Tennessee", "Tennessee",
     "no preliminary notice required", "Tennessee does not require preliminary notice for subcontractors. However, the lien must be filed and served within strict deadlines.",
     "90 days from last work", "90 days from last furnishing of labor or materials",
     "1 year", "1 year from filing the lien",
     "Is preliminary notice required in Tennessee?", "No. Tennessee does not require a preliminary notice. However, a copy of the filed lien must be served on the owner within strict deadlines after recording.",
     "What is the filing deadline for a Tennessee mechanics lien?", "You must file within 90 days from the last date of furnishing labor or materials. After filing, you must serve the owner within 5 days.",
     "How long does a Tennessee mechanics lien last?", "After filing, you have 1 year to foreclose. The 5-day service requirement after filing means you must act quickly on the back end as well.",
     "Tennessee's 5-day post-filing service requirement can be a trap. VoiceLogPro keeps you organized so you can meet every deadline in the lien process."),

    # ─── TEXAS ───
    ("texas", "Texas", "Texas",
     "Notice of Intent to Lien required", "Texas requires subcontractors with no direct contract with the owner to send a Notice of Intent to Lien at least 10 days before the lien filing deadline. For residential projects, a 15-day pre-lien notice is required.",
     "4th month from last work", "By the 15th day of the 4th month after the month of last furnishing (residential) or 4th month (commercial)",
     "1 year", "1 year from filing the lien",
     "Do Texas subcontractors need to send a preliminary notice?", "Texas does not call it a 'preliminary notice' but subcontractors who do not have a direct contract with the owner must send a Notice of Intent to Lien. For residential projects, a Notice to the Owner is due within 15 days of starting work.",
     "When is the Texas mechanics lien filing deadline?", "For commercial projects, file by the 15th day of the 4th month after the month you last furnished labor. For residential, the deadline is the 15th day of the 3rd month after last furnishing.",
     "Can I file a Texas mechanics lien without a written contract?", "Yes, Texas lien law covers oral contracts. However, proving the scope and value of work without a contract requires detailed daily records — exactly what VoiceLogPro provides.",
     "Texas lien law is deadline-driven and complex, especially with its unique month-based calculation system. VoiceLogPro's timestamped reports prove exactly when your last day of work occurred."),

    # ─── UTAH ───
    ("utah", "Utah", "Utah",
     "preliminary notice required within 20 days", "Utah requires subcontractors to serve a Preliminary Notice within 20 days of first furnishing labor or materials. Late notice limits recovery to work done after service.",
     "180 days from last work", "180 days from last furnishing of labor or materials",
     "180 days", "180 days from filing the lien",
     "Do Utah subcontractors need preliminary notice?", "Yes. Utah requires subcontractors and material suppliers to serve a Preliminary Notice within 20 days of first providing labor or materials to preserve full lien rights.",
     "What is the filing deadline in Utah?", "Utah provides 180 days from the last date of furnishing labor or materials to file a mechanics lien — one of the longest filing windows in the country.",
     "How long does a Utah mechanics lien last?", "Utah has a unique matched window: 180 days from filing to foreclose. Both the filing window and enforcement window are 180 days.",
     "Utah's 20-day notice requirement is standard for western states. Its 180-day filing window is generous. VoiceLogPro helps you track every deadline."),

    # ─── VERMONT ───
    ("vermont", "Vermont", "Vermont",
     "no preliminary notice required", "Vermont does not require preliminary notice for subcontractors on private projects.",
     "180 days from last work", "180 days from last furnishing of labor or materials",
     "1 year", "1 year from filing the lien",
     "Does Vermont require preliminary notice?", "No. Vermont does not have a preliminary notice requirement. Subcontractors can file a mechanics lien directly.",
     "What is the filing deadline in Vermont?", "You must file your mechanics lien within 180 days from the last date of furnishing labor or materials. This is one of the longest filing windows in the country.",
     "How long does a Vermont mechanics lien last?", "Once filed, you have 1 year to initiate a foreclosure action. The 180-day filing window combined with 1-year enforcement gives you substantial time.",
     "Vermont provides generous timeframes for its lien process. VoiceLogPro ensures every work day is documented from start to finish."),

    # ─── VIRGINIA ───
    ("virginia", "Virginia", "Virginia",
     "no preliminary notice required", "Virginia does not require preliminary notice for subcontractors on private projects. However, a Memorandum of Lien must be filed and served on the owner.",
     "90 days from last work", "90 days from last furnishing of labor or materials",
     "6 months", "6 months from filing the lien",
     "Is preliminary notice required in Virginia?", "No. Virginia does not require subcontractors to send a preliminary notice. However, you must file and serve a memorandum of mechanics lien within the 90-day window.",
     "What is the Virginia mechanics lien filing deadline?", "You have 90 days from the last date of furnishing labor or materials to file your memorandum of lien. After filing, you must serve the owner within a reasonable time.",
     "How long does a Virginia mechanics lien last?", "You have 6 months from filing to initiate a foreclosure lawsuit. This is a shorter enforcement window than many states.",
     "Virginia's 90-day filing deadline and 6-month enforcement period are both strict. VoiceLogPro's daily reports help you move quickly when payment issues arise."),

    # ─── WASHINGTON ───
    ("washington", "Washington", "Washington",
     "preliminary notice required within 60 days", "Washington requires subcontractors to serve a Notice of Right to Lien within 60 days of first furnishing labor or materials. This is required to preserve lien rights.",
     "90 days from last work", "90 days from last furnishing of labor or materials",
     "8 months", "8 months from filing the lien",
     "Do Washington subcontractors need preliminary notice?", "Yes. Washington requires subcontractors to serve a Notice of Right to Lien within 60 days of first providing labor or materials. For residential projects, the notice is due within 10 days.",
     "What is the filing deadline in Washington?", "Subcontractors must file their mechanics lien within 90 days from the last date of furnishing labor or materials to the project.",
     "How long does a Washington mechanics lien last?", "Once filed, you have 8 months to foreclose on a private project. This is a unique window — longer than many states but shorter than the typical 1 year.",
     "Washington's 60-day notice and 8-month enforcement periods have specific nuances. VoiceLogPro documents every work day with court-ready PDFs."),

    # ─── WEST VIRGINIA ───
    ("west-virginia", "West Virginia", "West Virginia",
     "no preliminary notice required", "West Virginia does not require preliminary notice for subcontractors on private projects.",
     "100 days from last work", "100 days from last furnishing of labor or materials",
     "1 year", "1 year from filing the lien",
     "Does West Virginia require preliminary notice?", "No. West Virginia does not have a preliminary notice requirement. However, the lien must be filed within 100 days and served on the owner.",
     "What is the filing deadline in West Virginia?", "West Virginia provides 100 days from the last furnishing of labor or materials — an unusual filing window that falls between the common 90 and 120-day periods.",
     "How long does a West Virginia mechanics lien last?", "After filing, you have 1 year to initiate a foreclosure action. If no suit is filed within 1 year, the lien expires.",
     "West Virginia's unique 100-day filing window catches many subcontractors off guard. VoiceLogPro tracks every work day so you know exactly when your deadline falls."),

    # ─── WISCONSIN ───
    ("wisconsin", "Wisconsin", "Wisconsin",
     "no preliminary notice required", "Wisconsin does not require preliminary notice. However, a Notice of Intent to File a Lien must be served 30 days before filing if demanded by the owner.",
     "6 months from last work", "6 months from last furnishing of labor or materials",
     "2 years", "2 years from filing the lien",
     "Is preliminary notice required in Wisconsin?", "No, Wisconsin does not require a preliminary notice. However, if the owner requests a notice of intent, you must serve one at least 30 days before filing.",
     "What is the Wisconsin lien filing deadline?", "You have 6 months from the last date of furnishing labor or materials to file your lien. This is one of the more generous deadlines in the country.",
     "How long does a Wisconsin mechanics lien last?", "Wisconsin provides a 2-year enforcement window from the date of filing. This is among the longest in the country, giving you time to negotiate.",
     "Wisconsin's 6-month filing window and 2-year enforcement period favor subcontractors. VoiceLogPro's daily reports ensure you have the evidence to back your claim."),

    # ─── WYOMING ───
    ("wyoming", "Wyoming", "Wyoming",
     "no preliminary notice required", "Wyoming does not require preliminary notice for subcontractors on private projects.",
     "4 months from last work", "4 months from last furnishing of labor or materials",
     "1 year", "1 year from filing the lien",
     "Does Wyoming require preliminary notice?", "No. Wyoming does not have a preliminary notice requirement. Subcontractors can file directly within the statutory period.",
     "What is the filing deadline in Wyoming?", "You must file your mechanics lien within 4 months from the last date of furnishing labor or materials to the project.",
     "How long does a Wyoming mechanics lien last?", "After filing, you have 1 year to initiate a foreclosure lawsuit. If no action is taken within 1 year, the lien expires.",
     "Wyoming's lien process is straightforward with no notice traps. VoiceLogPro keeps your daily logs organized and accessible."),

    # ─── DISTRICT OF COLUMBIA ───
    ("district-of-columbia", "District of Columbia", "District of Columbia",
     "no preliminary notice required (notice must be served after filing)", "DC does not require preliminary notice for subcontractors. However, the lien must be filed within strict deadlines and served on the owner within 10 days of filing.",
     "90 days from last work", "90 days from last furnishing of labor or materials",
     "1 year", "1 year from filing the lien",
     "Does DC require preliminary notice?", "No. The District of Columbia does not require a preliminary notice. However, after filing the mechanics lien, you must serve it on the owner within 10 days.",
     "What is the DC lien filing deadline?", "You must file within 90 days from the last date of furnishing labor or materials. After filing, serve the owner within 10 days.",
     "Can a subcontractor file a mechanics lien in DC?", "Yes, DC's lien law covers both subcontractors and material suppliers. The 90-day filing window and 10-day service requirement must both be strictly followed.",
     "DC's 10-day post-filing service requirement is a critical step. VoiceLogPro helps you track every deadline so nothing falls through the cracks."),
]

# ─── Template parts ──────────────────────────────────────────────────────────

HTML_HEAD_TOP = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title}</title>
<meta name="description" content="{meta_desc}">
<meta name="robots" content="index, follow">
<link rel="canonical" href="https://voicelogpro.com/states/{slug}-lien-law/">
<meta property="og:title" content="{og_title}">
<meta property="og:description" content="{og_desc}">
<meta property="og:type" content="article">
<meta property="og:url" content="https://voicelogpro.com/states/{slug}-lien-law/">
<script type="application/ld+json">{article_schema}</script>
<script type="application/ld+json">{breadcrumb_schema}</script>
<script type="application/ld+json">{faq_schema}</script>
<!-- canonical-disambiguation --><script type="application/ld+json">{org_schema}</script>
</head>
<body>
<main style="max-width:760px;margin:0 auto;padding:40px 20px;font-family:system-ui,sans-serif">
<h1>{state_name} Mechanics Lien Law Guide for Subcontractors</h1>"""

INTRO_TLDR = """
<p><strong>TL;DR:</strong> In {state_name}, the preliminary notice rule is: {notice_rule}. You must file your lien within {file_deadline}, and the enforcement deadline is {enforcement}. Daily construction reports are critical evidence for every step.</p>"""

SECTION_NOTICE = """
<h2>Preliminary Notice Requirements in {state_name}</h2>
<p>In {state_name}, subcontractors must follow strict notice rules to preserve lien rights. The key requirement: {notice_rule}. {intro_extra}</p>
<p>Missing this deadline forfeits your lien rights entirely — no exceptions. VoiceLogPro's voice-to-PDF daily reports timestamp every notice delivery automatically, creating an audit trail that holds up in court.</p>"""

SECTION_LIEN = """
<h2>Lien Filing Deadlines in {state_name}</h2>
<p>After your last day of work or material delivery, you have a window of {file_deadline} to file your mechanics lien ({file_desc}). This deadline is absolute. Late filing = no lien. Your daily reports serve as the definitive record of when work was performed, eliminating disputes about the last-furnishing date that GCs and owners commonly exploit.</p>"""

SECTION_ENFORCEMENT = """
<h2>Enforcement &amp; Duration</h2>
<p>Once filed, your lien is valid for {enforcement}. If payment is not received, you must initiate foreclosure proceedings within this window. Without contemporaneous daily documentation, proving your case in court becomes your word against theirs. VoiceLogPro creates timestamped, weather-verified, photo-attached PDFs that judges and arbitrators accept.</p>"""

SECTION_WHY_DAILY = """
<h2>Why Daily Reports Are Your Best Lien Protection</h2>
<p>Every lien dispute comes down to one question: "What work was done, and when?" Subcontractors who rely on memory or sparse notes lose. Subcontractors who produce dated, timestamped daily reports with crew lists, material logs, and weather data win. VoiceLogPro turns 60 seconds of voice dictation into a court-ready PDF — no typing, no laptop, no office. Speak your report from the job site. The app timestamps it, attaches the weather, and stores it in the cloud.</p>"""

SECTION_FAQ_START = """
<h2>Frequently Asked Questions</h2>"""
FAQ_Q_TMPL = """
<h3>{q}</h3>
<p>{a}</p>"""

FOOTER = """
<nav style="margin-top:40px;padding-top:20px;border-top:1px solid #e5e7eb">
  <p style="font-size:14px;color:#6b7280">More state lien guides: <a href="https://voicelogpro.com/blog/texas-property-code-chapter-53-guide-2025">Texas</a> · <a href="https://voicelogpro.com/states/florida-lien-law/">Florida</a> · <a href="https://voicelogpro.com/states/new-york-lien-law/">New York</a> · <a href="https://voicelogpro.com/states/illinois-lien-law/">Illinois</a> · <a href="https://voicelogpro.com/states/ohio-lien-law/">Ohio</a></p>
  <p style="margin-top:16px"><a href="https://voicelogpro.com/crew-plan" style="display:inline-block;background:#0066cc;color:white;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:700">Get Crew Plan — $49/month →</a></p>
  <p style="font-size:13px;color:#9ca3af;margin-top:8px">VoiceLogPro — Court-ready daily reports from your voice. Built for subcontractors.</p>
</nav>
</main>
<!-- BRUNSON TRUST BAR — idempotency:trust-bar-v1 -->
<section class="brunson-trust-bar" style="background:linear-gradient(135deg, #0f172a, #1e293b);color:#e8eaed;padding:40px 24px;margin:60px 0 0;border-top:3px solid #00d4aa;text-align:center;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <div style="max-width:900px;margin:0 auto">
    <div style="display:flex;flex-wrap:wrap;justify-content:center;gap:28px;margin-bottom:28px">
      <div><span style="font-size:1.6rem;font-weight:700;color:#00d4aa">60s</span><br><span style="font-size:.82rem;color:#94a3b8">Per report</span></div>
      <div><span style="font-size:1.6rem;font-weight:700;color:#00d4aa">0</span><br><span style="font-size:.82rem;color:#94a3b8">Lines to type</span></div>
      <div><span style="font-size:1.6rem;font-weight:700;color:#00d4aa">$49</span><br><span style="font-size:.82rem;color:#94a3b8">Founding /mo</span></div>
      <div><span style="font-size:1.6rem;font-weight:700;color:#00d4aa">Free</span><br><span style="font-size:.82rem;color:#94a3b8">Defense Kit</span></div>
    </div>
    <p style="font-size:1.05rem;margin-bottom:24px;color:#cbd5e1">Every report you type by hand is 60 minutes you will never get back. Founding price locks at sign-up.</p>
    <a href="https://voicelogpro.com/#waitlist" style="display:inline-block;background:linear-gradient(135deg,#00d4aa,#2deec0);color:#04130e;padding:14px 32px;border-radius:12px;font-weight:700;text-decoration:none;font-size:.95rem;box-shadow:0 8px 24px -10px rgba(0,212,170,.5)">Join the Waitlist →</a>
    <p style="margin-top:18px;font-size:.78rem;color:#6b7178">🛡️ 30-day money-back guarantee on every plan. Founders price locked forever.</p>
  </div>
</section>
<!-- /BRUNSON TRUST BAR -->
</body>
</html>"""


def build_faq_schema(state_name, q1, a1, q2, a2, q3, a3):
    entities = [
        {"@type": "Question", "name": q1, "acceptedAnswer": {"@type": "Answer", "text": a1}},
        {"@type": "Question", "name": q2, "acceptedAnswer": {"@type": "Answer", "text": a2}},
        {"@type": "Question", "name": q3, "acceptedAnswer": {"@type": "Answer", "text": a3}},
    ]
    return json.dumps({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": entities
    })


def build_article_schema(state_name):
    return json.dumps({
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": f"{state_name} Mechanics Lien Law Guide for Subcontractors",
        "description": f"Preliminary notice and lien deadlines for {state_name} subcontractors. Step-by-step guide to preserving payment rights.",
        "author": {"@type": "Organization", "name": "VoiceLogPro"},
        "publisher": {"@type": "Organization", "name": "VoiceLogPro", "url": "https://voicelogpro.com"},
        "datePublished": now
    })

def build_breadcrumb_schema(state_name):
    return json.dumps({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://voicelogpro.com/"},
            {"@type": "ListItem", "position": 2, "name": "State Lien Guides", "item": "https://voicelogpro.com/states/"},
            {"@type": "ListItem", "position": 3, "name": f"{state_name} Lien Law"}
        ]
    })

def build_org_schema():
    return json.dumps({
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "VoiceLogPro",
        "url": "https://voicelogpro.com",
        "description": "VoiceLogPro is a voice-to-PDF daily construction log app for contractors — general contractors, electricians, plumbers, HVAC, and roofers speak their on-site daily report and it becomes a timestamped, court-admissible PDF with fields for weather, crew, work performed, and materials, protecting mechanic's-lien and delay claims.",
        "disambiguatingDescription": "VoiceLogPro is a voice-to-PDF daily construction log app (voice on-site → timestamped, court-admissible daily-report PDF) — not a general-purpose meeting/voice-transcription tool (Otter, Rev, Fireflies), and not a full construction-management platform (Procore, Raken)."
    })


def generate_page(state_data):
    (slug, name_short, state_name,
     notice_rule, notice_desc,
     file_deadline, file_desc,
     enforcement, enforcement_desc,
     faq_q1, faq_a1, faq_q2, faq_a2, faq_q3, faq_a3,
     intro_extra) = state_data

    title = f"{state_name} Mechanics Lien Law Guide for Subcontractors | VoiceLogPro"
    meta_desc = f"{state_name} mechanics lien deadlines, preliminary notice rules, and enforcement timelines for subcontractors. Protect your lien rights with daily reports from VoiceLogPro."
    og_title = f"{state_name} Mechanics Lien Law for Subcontractors | VoiceLogPro"
    og_desc = f"Deadlines, notice rules, enforcement. How {state_name} subcontractors protect lien rights with daily logs."

    article_schema = build_article_schema(state_name)
    breadcrumb_schema = build_breadcrumb_schema(state_name)
    faq_schema = build_faq_schema(state_name, faq_q1, faq_a1, faq_q2, faq_a2, faq_q3, faq_a3)
    org_schema = build_org_schema()

    parts = []
    parts.append(HTML_HEAD_TOP.format(
        title=title, meta_desc=meta_desc, og_title=og_title, og_desc=og_desc,
        slug=slug, state_name=state_name,
        article_schema=article_schema, breadcrumb_schema=breadcrumb_schema,
        faq_schema=faq_schema, org_schema=org_schema
    ))
    parts.append(INTRO_TLDR.format(
        state_name=state_name, notice_rule=notice_rule,
        file_deadline=file_deadline, enforcement=enforcement
    ))
    parts.append(SECTION_NOTICE.format(
        state_name=state_name, notice_rule=notice_rule, intro_extra=intro_extra
    ))
    parts.append(SECTION_LIEN.format(
        state_name=state_name, file_deadline=file_deadline, file_desc=file_desc
    ))
    parts.append(SECTION_ENFORCEMENT.format(enforcement=enforcement))
    parts.append(SECTION_WHY_DAILY)
    parts.append(SECTION_FAQ_START)
    parts.append(FAQ_Q_TMPL.format(q=faq_q1, a=faq_a1))
    parts.append(FAQ_Q_TMPL.format(q=faq_q2, a=faq_a2))
    parts.append(FAQ_Q_TMPL.format(q=faq_q3, a=faq_a3))
    parts.append(FOOTER)

    return "\n".join(parts)


def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    generated = 0
    for state_data in STATES:
        slug = state_data[0]
        dir_path = os.path.join(OUTPUT_DIR, f"{slug}-lien-law")
        os.makedirs(dir_path, exist_ok=True)
        html = generate_page(state_data)
        filepath = os.path.join(dir_path, "index.html")
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(html)
        generated += 1
        print(f"  ✓ {slug}-lien-law/index.html")
    print(f"\nTotal: {generated} pages generated in {OUTPUT_DIR}")


if __name__ == "__main__":
    main()
