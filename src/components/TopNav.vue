<template>
    <div>
        <nav class="navbar navbar-expand-lg" id="navbar-tabs">
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerBidNav" aria-controls="navbarTogglerBidNav" aria-expanded="false" aria-label="Toggle navigation"> Menu
                <i class="fa fa-bars"></i>
            </button>

            <div class="collapse navbar-collapse in" id="navbarTogglerBidNav">
                <ul class="navbar-nav mr-0 mt-2 mt-lg-0">
                    <slot></slot>
                </ul>
            </div>
        </nav>
        <br>
        <router-view />
    </div>
</template>

