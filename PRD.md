<!-- GenZMart -->
1. Project Overview

The project is a full-stack e-commerce platform where customers can browse products, search and filter the catalog, manage a shopping cart and wishlist, place orders, make payments, track deliveries, manage their profiles and addresses, and provide ratings/reviews. Developers act as sellers/vendors who can manage their storefront, products, inventory, orders and sales information. Admin has centralized control over customers, developers/sellers, products, orders, payments, categories, coupons, reviews, settings and platform operations.

The application will use PHP, HTML, CSS, JavaScript, MySQL and MDBootstrap. Development will be performed on XAMPP and the same codebase should be deployable to cPanel without source-code changes, using one central configuration file for environment-specific values.

2. Technology Stack

Layer

Technology

Purpose

Backend

PHP

Business logic, authentication, CRUD, order processing, payment integration, file handling and server-side validation.

Frontend

HTML5, CSS3, JavaScript

Responsive pages, interactions, client-side validation and dynamic UI behavior.

Database

MySQL

Users, sellers, products, inventory, carts, orders, payments, reviews, coupons and settings.

UI Framework

MDBootstrap

Responsive grid, cards, forms, navbar, modals, alerts, tables and dashboard UI.

Local Environment

XAMPP

Apache/PHP/MySQL local development.

Production

cPanel

Hosting, database, PHP runtime, file deployment and domain configuration.

Storage

Product Media + Documents

Product images, banners, user/seller media and other approved files.

3. Architecture & Coding Rules

Each major page should preferably use one PHP file containing the page's frontend markup and backend processing logic.

Use one central config.php for database credentials, site URL, storage paths, global settings and environment values.

Use reusable includes/presets for header, footer, navigation, alerts, cards, forms, authentication helpers and common functions.

Use MySQL for persistent business data; do not duplicate database values in page files.

Use prepared statements, password hashing, CSRF protection, authorization checks and server-side validation.

Keep local XAMPP and production cPanel paths configurable so source code remains unchanged.

Separate customer, seller/developer and admin permissions strictly.

4. Recommended File Structure

ecommerce/

├── config.php

├── index.php

├── products.php

├── product.php

├── category.php

├── search.php

├── cart.php

├── wishlist.php

├── checkout.php

├── order.php

├── orders.php

├── profile.php

├── addresses.php

├── login.php

├── signup.php

├── seller-login.php

├── seller-signup.php

├── seller-dashboard.php

├── seller-products.php

├── seller-orders.php

├── seller-profile.php

├── admin-login.php

├── admin.php

├── admin-users.php

├── admin-sellers.php

├── admin-products.php

├── admin-orders.php

├── admin-categories.php

├── admin-coupons.php

├── admin-settings.php

├── includes/

│   ├── header.php

│   ├── footer.php

│   ├── navbar.php

│   ├── auth.php

│   ├── functions.php

│   ├── product-card.php

│   └── ui.php

├── assets/

│   ├── css/

│   ├── js/

│   └── images/

├── storage/

│   └── products/

└── database/

    └── schema.sql

5. Roles

Role

Purpose

User / Customer

Main buyer who discovers products and completes the complete shopping journey.

Developer / Seller

Seller/vendor who manages a storefront, products, inventory, orders and sales.

Admin

Platform owner/operator with complete management, moderation, reporting and settings access.

6. Role-Based Feature Specification

The feature scope is intentionally different for each role. The User/Customer receives the largest feature set because the customer journey covers discovery, comparison, cart, checkout, payment, order tracking, returns, reviews and account management.

6.1 USER / CUSTOMER — Complete Feature List

Customer Section

Features

Account & Authentication

Signup, login, logout, forgot password, reset password, email/phone validation, session management, account status, change password.

Home

Hero/banner, featured products, new arrivals, best sellers, trending products, deals/offers, categories, recommended products, recently viewed products.

Product Discovery

Browse all products, category/subcategory navigation, search, autocomplete, filters, sorting, pagination, product count.

Product Filters

Price range, category, brand, rating, availability, discount, attributes/variants, seller, newest/popular filters.

Product Details

Product gallery, zoom, description, specifications, variants, price, discount, stock status, seller info, delivery estimate, ratings, reviews, related products.

Product Comparison

Compare selected products, compare price, rating, specifications, availability and key attributes.

Wishlist

Add/remove wishlist items, wishlist page, move item to cart, wishlist availability/price indication.

Shopping Cart

Add product, update quantity, remove item, variant selection, stock validation, subtotal, discount, shipping charge, tax, grand total.

Cart Persistence

Keep cart for logged-in user, optionally preserve guest cart and merge it after login.

Coupons & Offers

Apply coupon, remove coupon, validate minimum order, expiry, usage limit and discount calculation.

Checkout

Address selection, add/edit address, delivery method, order summary, coupon, tax/shipping calculation and final total.

Address Book

Add, edit, delete, set default shipping address, billing address, multiple saved addresses.

Payment

Cash on delivery if enabled, online payment gateway integration, payment status, failed-payment handling, retry payment.

Order Placement

Create order, generate order number, order confirmation, order items snapshot, payment status and order timestamp.

My Orders

Order list, search/filter orders, order details, item details, amount, payment status and order status.

Order Tracking

Placed, confirmed, packed, shipped, out for delivery, delivered and other configured statuses.

Order Cancellation

Cancel eligible order/item, cancellation reason, cancellation status and refund initiation where applicable.

Returns & Refunds

Request return, select reason, upload supporting image if required, return status, refund status and return history.

Reviews & Ratings

Rate purchased product, write review, upload review images, edit/delete own review where allowed, review history.

Notifications

Order updates, payment status, shipping updates, promotional messages and account notifications.

Profile

View/edit name, profile image, email/phone, password and account preferences.

Purchase History

Completed orders, previous purchases, reorder/buy again functionality.

Support

Contact/support form, order-related query, FAQ/help section and issue reporting.

Security

Session protection, CSRF-secured actions, secure password handling and authorization for personal data.

Responsive Experience

Mobile-friendly shopping UI, responsive product cards, cart, checkout and account pages.

6.2 DEVELOPER / SELLER — Complete Feature List

Seller Section

Features

Seller Registration

Seller signup, business/store information, login credentials, validation and account status.

Seller Login

Secure login/logout, session handling, forgot/reset password and role-based access.

Seller Profile

Store name, logo, description, contact details, address, business information and profile update.

Seller Dashboard

Total products, active products, pending products, orders, sales, revenue, low-stock items and recent activity.

Product Management

Add product, edit product, delete/draft product, product description, category, brand, SKU, price and discount.

Product Media

Upload product images, thumbnails, gallery images and manage/remove media.

Product Variants

Size, color or other attributes, variant SKU, price and stock where applicable.

Inventory

Stock quantity, stock status, low-stock threshold, stock update and inventory visibility.

Product Status

Draft, pending approval, approved, rejected, inactive and published states.

Product Approval

Submit product for admin review and view approval/rejection status and rejection reason.

Order Management

View seller orders, order details, customer shipping information as permitted, item quantities and order status.

Order Processing

Accept/confirm order, prepare/pack, mark shipped, update delivery status and handle cancellation/return workflow.

Sales & Revenue

Sales totals, order count, revenue summary, product-wise sales and date-based sales overview.

Seller Reports

Sales reports, best-selling products, low-stock report and order-status summary.

Reviews

View customer reviews/ratings for seller products and respond where the platform policy permits.

Storefront

Public seller/store page, seller products, store description and basic seller information.

Seller Notifications

New order, approval/rejection, low stock, cancellation, return and other seller alerts.

Security

Seller-only authorization, secure sessions, protected product/order actions and input validation.

6.3 ADMIN — Complete Feature List

Admin Section

Features

Admin Authentication

Dedicated admin login, logout, session timeout, secure password handling and admin-only authorization.

Admin Dashboard

Users, sellers, products, orders, revenue, pending approvals, low-stock alerts, returns/refunds and platform summary.

User Management

View users, search/filter, activate/deactivate, suspend, view account details and customer order history.

Seller Management

View sellers, approve/reject seller accounts, activate/deactivate, suspend, view store and seller performance.

Product Management

View all products, edit/manage, approve/reject, publish/unpublish, activate/deactivate and remove products.

Product Moderation

Review product information/media, reject with reason, request correction and control visibility.

Category Management

Create/edit/delete categories and subcategories, status control, ordering and category image if required.

Brand Management

Create/edit/delete brands, status control and product association.

Order Management

View all orders, search/filter, order details, payment status, shipping status and overall order control.

Payment Management

Payment status monitoring, failed payments, refunds status and gateway configuration where applicable.

Return & Refund Management

Review return requests, approve/reject, refund status, return reason and resolution tracking.

Coupon Management

Create/edit/delete coupons, percentage/fixed discount, minimum order, expiry, usage limits and applicable products/categories.

Review Management

View, approve/hide/delete inappropriate reviews and manage reported reviews.

Inventory Oversight

Low-stock products, out-of-stock products and inventory overview across sellers.

Reports & Analytics

Sales, revenue, orders, users, sellers, products, top products, category performance and date-based reports.

Website Settings

Site name, logo, favicon, contact info, footer, homepage content, pagination, currency, tax/shipping settings and feature toggles.

Global Content

Banners, promotional sections, featured products, categories and other configurable homepage content.

Notifications

Admin alerts for seller approvals, product approvals, new orders, returns, reports and system events.

Audit & Control

Important admin action logs, status changes and moderation history where required.

7. Common Platform Modules

Module

Platform Scope

Authentication & Authorization

Separate User, Seller and Admin authentication with strict role permissions.

Catalog

Categories, subcategories, brands, products, variants, attributes, media and availability.

Commerce

Cart, wishlist, coupons, checkout, shipping, taxes, payment and order creation.

Order Lifecycle

Placed → Confirmed → Packed → Shipped → Out for Delivery → Delivered, plus cancellation/return/refund states.

Communication

Notifications, support/contact, order messages and system alerts.

Media Storage

Product images, banners, seller media and user profile media.

Configuration

Central config.php for database, URL, storage and environment values.

8. MySQL Database Plan

Table

Purpose

users

Customer accounts, credentials, role/status and timestamps.

sellers

Seller/developer business/store profile and approval/status.

categories

Product categories and subcategories.

brands

Product brands.

products

Product master data, seller, category, price, discount, SKU, status and timestamps.

product_variants

Size/color/attribute combinations, SKU, price and stock.

product_media

Product images/gallery and media metadata.

addresses

Customer shipping/billing addresses.

wishlists

Customer wishlist items.

cart / cart_items

Active customer cart and item quantities/variants.

coupons

Coupon rules, discount, expiry and usage limits.

orders

Order master, customer, totals, address snapshot, payment/order status.

order_items

Products, variants, seller, quantity, price and discount snapshot.

payments

Gateway/reference, amount, payment status and timestamps.

shipments

Shipping/tracking information and delivery status.

returns

Return request, reason, status and refund information.

reviews

Customer rating/review, product and order references, moderation status.

notifications

Role/user notifications and read status.

settings

Global configurable website settings.

audit_logs

Important admin/seller actions where auditability is required.

9. Main E-Commerce Workflows

9.1 Customer Purchase Workflow

Customer visits homepage or product catalog.

Customer searches, filters, sorts or browses categories.

Customer opens product details and checks price, variants, stock, ratings and reviews.

Customer adds product/variant to wishlist or cart.

Customer reviews cart, quantity, discount, shipping, tax and total.

Customer logs in/registers if required and selects delivery address.

Customer applies coupon if available.

Customer selects payment method and places order.

System creates order and records payment status.

Customer receives confirmation and tracks order status.

After delivery, customer can review/rate the purchased product and request return/refund if eligible.

9.2 Seller Workflow

Seller registers and completes store/business profile.

Admin approves seller if approval is enabled.

Seller creates products and uploads product media.

Seller adds variants, price, SKU and inventory.

Seller submits products for admin approval.

Admin approves/rejects products.

Approved products appear in the customer catalog.

Seller receives orders for its products.

Seller processes, packs and ships orders.

Seller monitors sales, revenue, inventory, ratings and order status.

9.3 Admin Workflow

Admin logs into the secure admin panel.

Admin reviews platform dashboard and pending actions.

Admin manages users and seller accounts.

Admin manages categories, brands and products.

Admin approves/rejects sellers and products.

Admin monitors orders, payments, returns and refunds.

Admin manages coupons, banners, reviews and website settings.

Admin reviews reports and important activity logs.

10. Central Configuration & Deployment

Database name, host, username, password and charset.

Website name, base URL and global branding.

Product/media storage directories.

Currency, tax/shipping defaults and pagination settings.

Upload size/type limits.

Environment flags such as development/production.

10.1 XAMPP Workflow

Place project inside htdocs.

Start Apache and MySQL.

Create MySQL database in phpMyAdmin.

Import schema.sql.

Update config.php for localhost.

Run complete customer, seller and admin workflows.

10.2 cPanel Workflow

Create production MySQL database/user.

Upload project directory.

Import database schema/data.

Update only config.php with production credentials and paths.

Set storage permissions and verify PHP extensions/limits.

Run production smoke tests.

11. Security Requirements

Password hashing with password_hash/password_verify.

Prepared statements for all database queries.

CSRF protection on state-changing forms.

Server-side validation for all user/seller/admin input.

HTML output escaping to prevent XSS.

Strict role-based authorization.

Secure session and cookie configuration.

Upload validation for product images and media.

Unique filenames and safe storage paths.

Protect config.php and sensitive credentials.

Validate stock and price on the server during checkout.

Prevent unauthorized order, payment, refund and seller-data access.

12. UI/UX Requirements

Use MDBootstrap consistently throughout the platform.

Customer UI should prioritize easy product discovery, product comparison and checkout.

Seller UI should prioritize simple product/order/inventory management.

Admin UI should prioritize tables, filters, status controls and dashboards.

Responsive design across desktop, tablet and mobile.

Consistent cards, buttons, forms, badges, alerts, modals and pagination.

Clear status labels and actionable validation/error messages.

13. Testing Checklist

Customer registration/login/profile/address management.

Product browsing/search/filter/sort.

Wishlist/cart/quantity/stock validation.

Coupon and price calculations.

Checkout and payment flow.

Order creation, tracking, cancellation and returns.

Ratings/reviews.

Seller registration/profile/product/inventory/order management.

Admin approvals and all CRUD/control operations.

Authorization tests for all three roles.

Security tests for SQL injection, XSS, CSRF and file uploads.

Responsive/mobile UI testing.

XAMPP fresh setup and cPanel fresh deployment.

14. A-to-Z Development Roadmap

Letter

Milestone

A

Architecture & requirements

B

Base project and folder structure

C

Central configuration

D

Database schema and relationships

E

Environment setup: XAMPP + cPanel compatibility

F

Frontend foundation with MDBootstrap

G

Global UI components/presets

H

Homepage and product catalog

I

Identity: customer/seller/admin authentication

J

JavaScript interactions and validation

K

Product catalog and product details

L

Login, authorization and role permissions

M

Media/product image management

N

Navigation and role-specific dashboards

O

Orders and checkout

P

Payments and payment-status handling

Q

Quality checks and edge cases

R

Ratings, reviews and returns

S

Seller/store and inventory management

T

Tracking, notifications and reports

U

User experience and responsive design

V

Validation and security hardening

W

Website settings, coupons and global content

X

XAMPP end-to-end testing

Y

cPanel deployment testing

Z

Production launch, backup and maintenance

15. Feature Priority

Priority

Scope

P0 — Core

Authentication, catalog, product details, cart, checkout, orders, seller products/inventory, admin approvals, MySQL, config and deployment.

P1 — Important

Wishlist, coupons, online payments, tracking, returns/refunds, reviews, seller analytics, admin reports, notifications.

P2 — Enhancement

Product comparison, advanced recommendations, advanced analytics, loyalty/wallet, richer seller tools, audit dashboards and optional integrations.

16. Definition of Done

Customer can complete a real end-to-end shopping journey.

Seller can manage products, inventory and orders.

Admin can control the marketplace and platform settings.

Products, orders, payments, reviews and inventory persist correctly in MySQL.

Role permissions prevent unauthorized actions.

The application is responsive and consistent using MDBootstrap.

The same source code works on XAMPP and cPanel through configuration changes only.

Critical security, validation and data-integrity issues are resolved before launch.

17. Project Summary

This documentation defines the project as an e-commerce platform rather than an APK provider/download platform. The User/Customer is the primary role and therefore has the broadest feature set covering discovery, search, filters, comparison, wishlist, cart, coupons, checkout, payment, orders, tracking, cancellation, returns, refunds, reviews, notifications, addresses, profile and support. The Developer/Seller role is focused on selling operations such as store management, product creation, inventory, orders and sales. Admin has centralized control over the entire platform.