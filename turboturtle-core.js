// --- 2.4. CITY LAYER REVEALS ENGINE (顯著高處沉降歸位版) ---
      var mountainTrigger = exists(".about_moutain") ? ".about_moutain" : exists(".about_mountain") ? ".about_mountain" : "body";

      var cityReveals = [
        // 角色與特殊物件 (從高處大幅向下降落)
        { sel: ".about_cityqueen",       from: { y: "-60vh" }, to: { y: "0vh" }, start: "100%", end: "0%" },
        { sel: ".about_doggod",          from: { x: "10vw" },  to: { x: "0vw" }, start: "100%", end: "0%" },
        { sel: ".about_crystal",         from: { y: "-40vh" }, to: { y: "0vh" }, start: "100%", end: "0%" },
        { sel: ".about_frog",            from: { y: "-50vh" }, to: { y: "0vh" }, start: "100%", end: "0%" },
        { sel: ".about_violincat",       from: { x: "8vw" },   to: { x: "0vw" }, start: "100%", end: "0%" },

        // 城市建築全體 (大幅拉開由 -40vh 至 -100vh 的高差降落)
        { sel: ".about_citybuilding_4",  from: { y: "-40vh" }, to: { y: "0vh" }, start: "100%", end: "0%" },
        { sel: ".about_citybuilding_3",  from: { y: "-50vh" }, to: { y: "0vh" }, start: "100%", end: "0%" },
        { sel: ".about_citybuilding_6",  from: { y: "-60vh" }, to: { y: "0vh" }, start: "100%", end: "0%" },
        { sel: ".about_citybuilding_5",  from: { y: "-70vh" }, to: { y: "0vh" }, start: "100%", end: "0%" },
        { sel: ".about_citybuilding_2",  from: { y: "-80vh" }, to: { y: "0vh" }, start: "100%", end: "0%" },
        { sel: ".about_backlayer",       from: { y: "-90vh" }, to: { y: "0vh" }, start: "100%", end: "0%" },
        { sel: ".about_mountain",        from: { y: "-100vh" }, to: { y: "0vh" }, start: "100%", end: "0%" },
        { sel: ".about_eyetower",        from: { y: "-80vh" }, to: { y: "0vh" }, start: "100%", end: "0%" },
        { sel: ".about_citytree_1",      from: { y: "-60vh" }, to: { y: "0vh" }, start: "100%", end: "0%" },
        { sel: ".about_citytree_2",      from: { y: "-60vh" }, to: { y: "0vh" }, start: "100%", end: "0%" },
        { sel: ".about_citytree_3",      from: { y: "-60vh" }, to: { y: "0vh" }, start: "100%", end: "0%" },
        { sel: ".about_citytree_4",      from: { y: "-50vh" }, to: { y: "0vh" }, start: "100%", end: "0%" }
      ];

      cityReveals.forEach(function (item) {
        if (exists(item.sel)) {
          gsap.fromTo(item.sel, item.from, Object.assign({}, item.to, {
            ease: "none", // 改為 linear 讓沉降過渡非常明顯且均勻
            scrollTrigger: {
              trigger: mountainTrigger,
              start: "top " + (item.start || "100%"),
              end: "top " + (item.end || "0%"), // 設定為 0% 代表一路沉降到畫面頂部
              scrub: true
            }
          }));
        }
      });
