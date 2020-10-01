<template>
    <nav class="navbar mb-5 navbar-expand-lg navbar-custom fixed-top top-nav-collapse">
        <div class="container">
            <router-link :to="{ name: 'home' }" class="navbar-brand logo-text page-scroll">JBid</router-link>

            <!-- Mobile Menu Toggle Button -->
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault"
                    aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-awesome fa fa-bars"></span>
                <span class="navbar-toggler-awesome fa fa-times"></span>
            </button>
            <!-- end of mobile menu toggle button -->
            <div class="collapse navbar-collapse" id="navbarsExampleDefault">
                <ul class="navbar-nav ml-auto">
                    <li class="nav-item">
                        <router-link :to="{ name: 'home' }" class="nav-link page-scroll">HOME<span class="sr-only">(current)</span>
                        </router-link>
                    </li>
                    <li class="nav-item">
                        <router-link :to="{ name: 'quote' }" class="nav-link">GET BID BOND QUOTE</router-link>
                    </li>
                </ul>
                <span class="nav-item">
                        <router-link :to="{ name: 'register' }" class="btn-outline-sm">REGISTER</router-link>
                        <router-link :to="{ name: 'login' }" class="btn-outline-sm">LOG IN</router-link>
                    </span>
            </div>
        </div> <!-- end of container -->
    </nav>
</template>
