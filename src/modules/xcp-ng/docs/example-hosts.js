const hosts = {
    "OpaqueRef:eb97f5f9-57ca-4006-bfa5-9b9436b2c31a": {
        uuid: "3c1973a7-bfb8-484b-a143-7c5a38085970",
        name_label: "bcn-pw-vmhost001",
        name_description: "VM Host in PW CTA",
        memory_overhead: 1426870272,
        allowed_operations: ["vm_migrate", "provision", "vm_resume", "evacuate", "vm_start"],
        current_operations: {},
        API_version_major: 2,
        API_version_minor: 10,
        API_version_vendor: "XenSource",
        API_version_vendor_implementation: {},
        enabled: true,
        software_version: {
            product_version: "7.5.0",
            product_version_text: "7.5",
            product_version_text_short: "7.5",
            platform_name: "XCP",
            platform_version: "2.6.0",
            product_brand: "XCP-ng",
            build_number: "release/kolkata/master/29",
            hostname: "localhost",
            date: "2018-07-26",
            dbv: "0.0.1",
            xapi: "1.20",
            xen: "4.7.5-5.5.1.xcp",
            linux: "4.4.0+10",
            xencenter_min: "2.10",
            xencenter_max: "2.10",
            network_backend: "openvswitch",
            db_schema: "5.142",
        },
        other_config: {
            agent_start_time: "1625824818.",
            boot_time: "1625824664.",
            MAINTENANCE_MODE_EVACUATED_VMS_MIGRATED:
                "cde093fa-90ee-0d4d-971a-4d4f83ad12a8,b5595a7e-b88c-1e81-3a5d-b3430210b015,3e92d751-51db-a8be-0cd1-6703b5db323e,16cc8fcb-73f4-fe37-3546-56b08bb89587,abaf2549-099f-c90e-4842-2ca88e713313,89a8a11b-603e-e40d-9a42-e08e1e0ece56,1b1bc7b1-0396-c3ef-3489-ee41e2f7b640,612b8835-dd23-3811-07c8-bb2310299198,6b165629-a859-c2b7-6dbc-dfd4a641bf02",
            iscsi_iqn: "iqn.2018-10.com.example:576c069f",
        },
        capabilities: ["xen-3.0-x86_64", "xen-3.0-x86_32p", "hvm-3.0-x86_32", "hvm-3.0-x86_32p", "hvm-3.0-x86_64", ""],
        cpu_configuration: {},
        sched_policy: "credit",
        supported_bootloaders: ["pygrub", "eliloader"],
        resident_VMs: [
            "OpaqueRef:575d0354-be7e-43f6-9279-454b7fdef216",
            "OpaqueRef:03aae54f-2893-4c67-8e45-b9635f8acefa",
            "OpaqueRef:09af4948-44f4-4d6d-9752-93b9762ee10f",
            "OpaqueRef:d67fe405-632d-4219-98d1-47b393dc403f",
            "OpaqueRef:460ce4b4-abaf-4887-b79d-2e84db5fbbd9",
            "OpaqueRef:b7546f23-8fd9-41a9-9f45-660de79101d1",
            "OpaqueRef:991b181a-6350-4f91-b656-acb7058a3dd5",
            "OpaqueRef:8e9badef-b341-4700-b027-ed6d3902d596",
            "OpaqueRef:e4c7735a-625b-466d-a8ea-4fe5804806a7",
            "OpaqueRef:d5228229-4667-4aae-b58c-b1092b26fe58",
            "OpaqueRef:54fa98fd-d47d-4b17-9d8b-5bb793a7ce19",
            "OpaqueRef:f4de3b1d-4e6e-45bf-9b7b-83f52547062f",
            "OpaqueRef:05d38954-863b-45b6-83fc-422501f7d2dd",
            "OpaqueRef:d76ed2f2-9876-46aa-b363-1e11b0a2b7d7",
        ],
        logging: {},
        PIFs: [
            "OpaqueRef:ee02ebf1-7c11-4ece-bf29-2f37c2d7d4c8",
            "OpaqueRef:5a3b484a-d508-4de9-b348-5eb9100fa6c9",
            "OpaqueRef:f7f1c245-140d-4610-81bb-6103cce24a5b",
            "OpaqueRef:deb7f7dc-d3b1-471c-9f03-3f0d13ec0074",
            "OpaqueRef:d2de6223-ed4b-4469-ae6c-91a2d0fcb497",
            "OpaqueRef:9d2ee9ca-d42f-433d-bd24-ab55187fd577",
            "OpaqueRef:987c04ea-5712-403e-8aa2-fbeb88b0519a",
            "OpaqueRef:8cd3b8f9-5d39-4476-82ca-4814397e7069",
            "OpaqueRef:3c007bd2-550f-4b63-aadc-a9829241155d",
            "OpaqueRef:39625b36-125e-441a-94f5-2395b17cf9cc",
            "OpaqueRef:382c8440-af03-4863-ab3f-e3718ea4c500",
            "OpaqueRef:17cf8288-a55b-4fe9-881e-e03a13bbf242",
            "OpaqueRef:1280a71e-477c-4264-ace1-2884e699f3e4",
        ],
        suspend_image_sr: "OpaqueRef:98a68dc9-9dc3-4a2e-9241-2f6b453dbdf0",
        crash_dump_sr: "OpaqueRef:98a68dc9-9dc3-4a2e-9241-2f6b453dbdf0",
        crashdumps: [],
        patches: [],
        updates: [],
        PBDs: [
            "OpaqueRef:c63bff11-47c4-4fbb-9b1c-f1afd27580ea",
            "OpaqueRef:80f715ca-4a27-4ad2-9aea-1b5eb8420d7e",
            "OpaqueRef:703b6ad3-6c0e-45f6-9443-ce60e9cc99be",
            "OpaqueRef:23476c8d-9b26-4cab-b72c-404dacc07935",
            "OpaqueRef:1997c64a-e087-481f-9569-79e0232d0fad",
            "OpaqueRef:175abc97-f71f-41f2-b30c-b282c254a7cb",
        ],
        host_CPUs: [
            "OpaqueRef:73c7a214-d441-4bac-ae1d-e26df8475e7b",
            "OpaqueRef:3f87f830-9999-4e02-b9b3-f020e80926ea",
            "OpaqueRef:3f226921-f80f-4eb0-99f5-7cbd2697fdab",
            "OpaqueRef:215ed9b1-e304-4e7b-b7fc-7b45786a4bc4",
            "OpaqueRef:5d5c55d5-36f1-4660-9480-ac9feafa5bfb",
            "OpaqueRef:cec5f5a2-f4a7-4c08-8b90-73119411b604",
            "OpaqueRef:eae69bfc-bddb-43ae-9e44-0f5174248aa8",
            "OpaqueRef:7a146b93-a23e-4d7c-b62a-af53d4b652c7",
            "OpaqueRef:bf1fd8ba-7ce5-478f-8d0c-3f1dcf0be4ab",
            "OpaqueRef:94305a3c-6107-4d02-8854-78198444963f",
            "OpaqueRef:8f71fc44-7221-47ef-bf6f-4102986d3596",
            "OpaqueRef:8be02843-17db-4030-a43d-7475bd2b89cf",
            "OpaqueRef:2cc4b355-f81d-47c2-b059-79e689ef423f",
            "OpaqueRef:a44f4464-bc2a-4503-b82c-054683956e90",
            "OpaqueRef:5a1f8d10-3dbf-48ef-bab0-1e055053a32f",
            "OpaqueRef:09b4c954-435c-49b9-a3ac-2be807beacc2",
            "OpaqueRef:3f46958f-d9aa-473e-8777-d152926e8ca3",
            "OpaqueRef:3dfd2c38-8cde-4847-b546-b4b9c4510dfa",
            "OpaqueRef:783b80eb-ad30-4e78-8695-b0cbb05e71c3",
            "OpaqueRef:5f013d57-7132-4e62-85fd-15a491e2f7e1",
            "OpaqueRef:d43d54ca-eb9a-435b-8217-06f713ae8cd8",
            "OpaqueRef:2fa133b3-52aa-4b69-a23d-8173190ec106",
            "OpaqueRef:2052afd1-0f03-4e77-8bc0-22dce7ccda75",
            "OpaqueRef:8daa8176-8e78-4d8e-ba0e-415bdec8cbc4",
            "OpaqueRef:3b5ac0e4-9a08-4f4b-867a-ec0a06252c69",
            "OpaqueRef:4d231681-5483-4b4d-bed6-b543af8593bd",
            "OpaqueRef:b14c4650-de22-4a21-8ff2-fdb52f079e9e",
            "OpaqueRef:be1dd0d4-bc6a-45c8-88e6-1b43a745bf40",
            "OpaqueRef:ba4cce7a-ba76-473f-8719-004124be98e0",
            "OpaqueRef:dee8b18f-65da-434d-8e4a-1cddd064ce0a",
            "OpaqueRef:b43a3630-c7e5-4cec-8100-2641652083e8",
            "OpaqueRef:3d89f470-97a9-4000-a447-5b2bd54ee80d",
        ],
        cpu_info: {
            cpu_count: "32",
            socket_count: "2",
            vendor: "GenuineIntel",
            speed: "2097.578",
            modelname: "Intel(R) Xeon(R) CPU E5-2620 v4 @ 2.10GHz",
            family: "6",
            model: "79",
            stepping: "1",
            flags: "fpu de tsc msr pae mce cx8 apic sep mca cmov pat clflush acpi mmx fxsr sse sse2 ht syscall nx lm constant_tsc arch_perfmon rep_good nopl nonstop_tsc eagerfpu pni pclmulqdq monitor est ssse3 fma cx16 sse4_1 sse4_2 movbe popcnt aes xsave avx f16c rdrand hypervisor lahf_lm abm 3dnowprefetch ida arat epb pln pts dtherm fsgsbase bmi1 hle avx2 bmi2 erms rtm rdseed adx xsaveopt cqm_llc cqm_occup_llc",
            features: "7ffefbff-bfebfbff-00000121-2c100800",
            features_pv: "17c9cbf5-f6f83203-2191cbf5-00000123-00000001-000c0b39-00000000-00000000-00001000-8c000000",
            features_hvm: "17cbfbff-f7fa3223-2d93fbff-00000123-00000001-001c0fbb-00000000-00000000-00001000-9c000000",
        },
        hostname: "bcn-pw-vmhost001",
        address: "172.26.108.1",
        metrics: "OpaqueRef:13e537a5-f9a0-48b3-9088-948965d54a69",
        license_params: {
            restrict_vswitch_controller: "false",
            restrict_lab: "false",
            restrict_stage: "false",
            restrict_storagelink: "false",
            restrict_storagelink_site_recovery: "false",
            restrict_web_selfservice: "false",
            restrict_web_selfservice_manager: "false",
            restrict_hotfix_apply: "false",
            restrict_export_resource_data: "false",
            restrict_read_caching: "false",
            restrict_cifs: "false",
            restrict_health_check: "false",
            restrict_xcm: "false",
            restrict_vm_memory_introspection: "false",
            restrict_batch_hotfix_apply: "false",
            restrict_management_on_vlan: "false",
            restrict_ws_proxy: "false",
            restrict_vlan: "false",
            restrict_qos: "false",
            restrict_pool_attached_storage: "false",
            restrict_netapp: "false",
            restrict_equalogic: "false",
            restrict_pooling: "false",
            enable_xha: "true",
            restrict_marathon: "false",
            restrict_email_alerting: "false",
            restrict_historical_performance: "false",
            restrict_wlb: "false",
            restrict_rbac: "false",
            restrict_dmc: "false",
            restrict_checkpoint: "false",
            restrict_cpu_masking: "false",
            restrict_connection: "false",
            platform_filter: "false",
            regular_nag_dialog: "false",
            restrict_vmpr: "false",
            restrict_vmss: "false",
            restrict_intellicache: "false",
            restrict_gpu: "false",
            restrict_dr: "false",
            restrict_vif_locking: "false",
            restrict_storage_xen_motion: "false",
            restrict_vgpu: "false",
            restrict_integrated_gpu_passthrough: "false",
            restrict_vss: "false",
            restrict_guest_agent_auto_update: "false",
            restrict_pci_device_for_auto_update: "false",
            restrict_xen_motion: "false",
            restrict_guest_ip_setting: "false",
            restrict_ad: "false",
            restrict_ssl_legacy_switch: "false",
            restrict_nested_virt: "false",
            restrict_live_patching: "false",
            restrict_set_vcpus_number_live: "false",
            restrict_pvs_proxy: "false",
            restrict_igmp_snooping: "false",
            restrict_rpu: "false",
            restrict_pool_size: "false",
            restrict_cbt: "false",
            restrict_usb_passthrough: "false",
            restrict_network_sriov: "false",
            restrict_corosync: "false",
        },
        ha_statefiles: [],
        ha_network_peers: [],
        blobs: {},
        tags: [],
        external_auth_type: "",
        external_auth_service_name: "",
        external_auth_configuration: {},
        edition: "xcp-ng",
        license_server: { address: "localhost", port: "27000" },
        bios_strings: {
            "bios-vendor": "HP",
            "bios-version": "P89",
            "system-manufacturer": "HP",
            "system-product-name": "ProLiant DL360 Gen9",
            "system-version": "",
            "system-serial-number": "CZJ7230GVG",
            "oem-1": "Xen",
            "oem-2": "MS_VM_CERT/SHA1/bdbeb6e0a816d43fa6d3fe8aaef04c2bad9d3e3d",
            "oem-3": "PSF:",
            "oem-4": "Product ID: 843374-425",
            "oem-5": "OEM String:",
            "hp-rombios": "COMPAQ",
        },
        power_on_mode: "",
        power_on_config: {},
        local_cache_sr: "OpaqueRef:NULL",
        chipset_info: { iommu: "true" },
        PCIs: [
            "OpaqueRef:f525f02e-bb48-402f-a9da-5c4894ec70b9",
            "OpaqueRef:ef1f6ee1-ab51-451d-b450-0789ec2510ca",
            "OpaqueRef:e12cfcf5-bf94-45ae-8772-4d941e00368f",
            "OpaqueRef:d5f1a60c-925e-4634-8511-a53e2aaad854",
            "OpaqueRef:c113791d-c408-43c5-8206-f224a7c9ef6a",
            "OpaqueRef:b9fc9303-df96-48b8-af70-18c8766d2471",
            "OpaqueRef:b13f651e-a6aa-458f-ad2a-e3798d75b5e5",
            "OpaqueRef:6a494f00-d737-4374-a7cb-f2407f0893fa",
            "OpaqueRef:68c373b1-74a0-49ab-96c8-652102560aa8",
            "OpaqueRef:58c492da-b10a-4312-b87c-d067295e99f1",
            "OpaqueRef:564ceb80-ed1d-4595-9258-a0f040bf7756",
            "OpaqueRef:43ea4441-6fa0-4490-8278-6fb3538de93e",
            "OpaqueRef:23be5d63-bc1b-4f2f-8c26-b75b0de1738e",
            "OpaqueRef:0aa71916-e39e-4ff1-9cae-50c4d99bb30a",
        ],
        PGPUs: ["OpaqueRef:c14b2091-66a4-43e7-98db-92bf60cb9eb7"],
        PUSBs: [],
        ssl_legacy: true,
        guest_VCPUs_params: {},
        display: "enabled",
        virtual_hardware_platform_versions: [0, 1, 2],
        control_domain: "OpaqueRef:d76ed2f2-9876-46aa-b363-1e11b0a2b7d7",
        updates_requiring_reboot: [],
        features: [],
        iscsi_iqn: "iqn.2018-10.com.example:576c069f",
        multipathing: false,
    },
    "OpaqueRef:b5ea0efb-c0d4-4254-a122-7fe8052f6701": {
        uuid: "32a9b4b3-b33c-45e8-80ec-53cb89972565",
        name_label: "bcn-pw-vmhost002",
        name_description: "VM Host in PW CTA",
        memory_overhead: 1447383040,
        allowed_operations: ["vm_migrate", "provision", "vm_resume", "evacuate", "vm_start"],
        current_operations: {},
        API_version_major: 2,
        API_version_minor: 10,
        API_version_vendor: "XenSource",
        API_version_vendor_implementation: {},
        enabled: true,
        software_version: {
            product_version: "7.5.0",
            product_version_text: "7.5",
            product_version_text_short: "7.5",
            platform_name: "XCP",
            platform_version: "2.6.0",
            product_brand: "XCP-ng",
            build_number: "release/kolkata/master/29",
            hostname: "localhost",
            date: "2018-07-26",
            dbv: "0.0.1",
            xapi: "1.20",
            xen: "4.7.5-5.5.1.xcp",
            linux: "4.4.0+10",
            xencenter_min: "2.10",
            xencenter_max: "2.10",
            network_backend: "openvswitch",
            db_schema: "5.142",
        },
        other_config: {
            last_blob_sync_time: "1658146179.88",
            agent_start_time: "1655160474.",
            boot_time: "1648055192.",
            iscsi_iqn: "iqn.2017-02.com.example:ebf89764",
        },
        capabilities: ["xen-3.0-x86_64", "xen-3.0-x86_32p", "hvm-3.0-x86_32", "hvm-3.0-x86_32p", "hvm-3.0-x86_64", ""],
        cpu_configuration: {},
        sched_policy: "credit",
        supported_bootloaders: ["pygrub", "eliloader"],
        resident_VMs: [
            "OpaqueRef:dc60cf90-f14d-4adb-86dc-99eb7872eb2a",
            "OpaqueRef:5ca2495b-5af7-4697-80c4-18f7a2651542",
            "OpaqueRef:002978dd-1063-4016-a119-49e8692d0e1a",
            "OpaqueRef:9e6c4a1f-dd93-40b9-9ef0-b35529269317",
            "OpaqueRef:5061a5ca-074a-4244-afab-1d2f43b8fdf4",
            "OpaqueRef:8e485fb7-186f-4cf1-82ce-26c9de4e3903",
            "OpaqueRef:8c6256a4-b701-4749-b6a9-8d1e32f71ce2",
            "OpaqueRef:8d796b75-0938-46d8-a029-641244b2371a",
            "OpaqueRef:6d5c1a9a-f55d-4755-becf-bcfb77fe7d21",
            "OpaqueRef:558b2831-a404-459c-bc8b-b7f6fb338cf3",
        ],
        logging: {},
        PIFs: [
            "OpaqueRef:390a531f-e065-4761-b429-bb65b4dc3ee8",
            "OpaqueRef:757b7228-c3bf-4324-98d3-9fc8fc2eec87",
            "OpaqueRef:fc80b199-5333-48a9-96df-0b8092571723",
            "OpaqueRef:dc54267f-86ee-4112-b5cf-db8c13b7f272",
            "OpaqueRef:bbaa0551-067f-4909-80c3-b5c1852df372",
            "OpaqueRef:7bb17ede-12d7-44bd-8400-8792132d6e5e",
            "OpaqueRef:6c8caac4-8906-4862-830b-931fbfad2d5c",
            "OpaqueRef:64583bb0-9aa8-4946-8347-4c32ea9ef0bd",
            "OpaqueRef:5438e5b0-630d-4f0e-8528-35a025e8066f",
            "OpaqueRef:4b99c7eb-3f73-4e09-81d0-974c4a3489d3",
            "OpaqueRef:3426129d-5ed8-439c-8e7f-d5d6d1817f4e",
            "OpaqueRef:24fc9604-6592-4894-9c30-d9bf8f1ba08b",
            "OpaqueRef:0c5f872c-4c23-4687-a928-55a423ccc9c9",
        ],
        suspend_image_sr: "OpaqueRef:337503e5-4f2c-4430-99ad-2db8ab525fe9",
        crash_dump_sr: "OpaqueRef:337503e5-4f2c-4430-99ad-2db8ab525fe9",
        crashdumps: [],
        patches: [],
        updates: [],
        PBDs: [
            "OpaqueRef:8c3df1d4-2fe5-4f47-9bc2-686b0ae3dba1",
            "OpaqueRef:63d7bf9e-0d7c-49de-9ba9-72d79dd96f3c",
            "OpaqueRef:4626350e-8c1b-432d-b524-5c43dfb0d7c9",
            "OpaqueRef:4247f08c-84c7-4c89-aeeb-372715538b77",
            "OpaqueRef:3f12bd54-e478-4873-82b1-531165aa874f",
            "OpaqueRef:306c9b90-c4f6-45df-8d76-60bb854b92a2",
        ],
        host_CPUs: [
            "OpaqueRef:faff3ad5-8a5d-4a86-85be-78c4e6a66f42",
            "OpaqueRef:043650fe-3843-49b1-8eb4-2369f92d869a",
            "OpaqueRef:1849a6df-b536-4887-b53c-81647ebfd52a",
            "OpaqueRef:859ab764-4ad7-43ef-b69c-6dfd95867875",
            "OpaqueRef:5887ad6b-8037-4ea5-b99d-2fed1e8a8182",
            "OpaqueRef:0d0e427c-f852-46f1-a8e2-7425ceedb50e",
            "OpaqueRef:fd0edbbb-9f96-4567-8d25-f3983d49e99c",
            "OpaqueRef:308dd85a-0dca-4118-9882-29ff661de591",
            "OpaqueRef:d84da3f8-51ce-46c8-b385-ccac8b5b353e",
            "OpaqueRef:7199e0b8-ecb7-4676-a06e-13fc5da03629",
            "OpaqueRef:18437058-3271-40f1-8f34-24824b441260",
            "OpaqueRef:1c6ebac7-7b82-4fc4-9f1e-e243c1b3cc04",
        ],
        cpu_info: {
            cpu_count: "12",
            socket_count: "1",
            vendor: "GenuineIntel",
            speed: "2397.234",
            modelname: "Intel(R) Xeon(R) CPU E5-2620 v3 @ 2.40GHz",
            family: "6",
            model: "63",
            stepping: "2",
            flags: "fpu de tsc msr pae mce cx8 apic sep mca cmov pat clflush acpi mmx fxsr sse sse2 ht syscall nx lm constant_tsc arch_perfmon rep_good nopl nonstop_tsc eagerfpu pni pclmulqdq monitor est ssse3 fma cx16 sse4_1 sse4_2 movbe popcnt aes xsave avx f16c rdrand hypervisor lahf_lm abm ida arat epb pln pts dtherm fsgsbase bmi1 avx2 bmi2 erms xsaveopt cqm_llc cqm_occup_llc",
            features: "7ffefbff-bfebfbff-00000021-2c100800",
            features_pv: "17c9cbf5-f6f83203-2191cbf5-00000023-00000001-00000329-00000000-00000000-00001000-8c000000",
            features_hvm: "17cbfbff-f7fa3223-2d93fbff-00000023-00000001-000007ab-00000000-00000000-00001000-9c000000",
        },
        hostname: "bcn-pw-vmhost002",
        address: "172.26.108.2",
        metrics: "OpaqueRef:cb28c562-9f2f-4274-8bba-bdf0b0d52f4c",
        license_params: {
            restrict_vswitch_controller: "false",
            restrict_lab: "false",
            restrict_stage: "false",
            restrict_storagelink: "false",
            restrict_storagelink_site_recovery: "false",
            restrict_web_selfservice: "false",
            restrict_web_selfservice_manager: "false",
            restrict_hotfix_apply: "false",
            restrict_export_resource_data: "false",
            restrict_read_caching: "false",
            restrict_cifs: "false",
            restrict_health_check: "false",
            restrict_xcm: "false",
            restrict_vm_memory_introspection: "false",
            restrict_batch_hotfix_apply: "false",
            restrict_management_on_vlan: "false",
            restrict_ws_proxy: "false",
            restrict_vlan: "false",
            restrict_qos: "false",
            restrict_pool_attached_storage: "false",
            restrict_netapp: "false",
            restrict_equalogic: "false",
            restrict_pooling: "false",
            enable_xha: "true",
            restrict_marathon: "false",
            restrict_email_alerting: "false",
            restrict_historical_performance: "false",
            restrict_wlb: "false",
            restrict_rbac: "false",
            restrict_dmc: "false",
            restrict_checkpoint: "false",
            restrict_cpu_masking: "false",
            restrict_connection: "false",
            platform_filter: "false",
            regular_nag_dialog: "false",
            restrict_vmpr: "false",
            restrict_vmss: "false",
            restrict_intellicache: "false",
            restrict_gpu: "false",
            restrict_dr: "false",
            restrict_vif_locking: "false",
            restrict_storage_xen_motion: "false",
            restrict_vgpu: "false",
            restrict_integrated_gpu_passthrough: "false",
            restrict_vss: "false",
            restrict_guest_agent_auto_update: "false",
            restrict_pci_device_for_auto_update: "false",
            restrict_xen_motion: "false",
            restrict_guest_ip_setting: "false",
            restrict_ad: "false",
            restrict_ssl_legacy_switch: "false",
            restrict_nested_virt: "false",
            restrict_live_patching: "false",
            restrict_set_vcpus_number_live: "false",
            restrict_pvs_proxy: "false",
            restrict_igmp_snooping: "false",
            restrict_rpu: "false",
            restrict_pool_size: "false",
            restrict_cbt: "false",
            restrict_usb_passthrough: "false",
            restrict_network_sriov: "false",
            restrict_corosync: "false",
        },
        ha_statefiles: [],
        ha_network_peers: [],
        blobs: {},
        tags: [],
        external_auth_type: "",
        external_auth_service_name: "",
        external_auth_configuration: {},
        edition: "xcp-ng",
        license_server: { address: "localhost", port: "27000" },
        bios_strings: {
            "bios-vendor": "HP",
            "bios-version": "P89",
            "system-manufacturer": "HP",
            "system-product-name": "ProLiant DL360 Gen9",
            "system-version": "",
            "system-serial-number": "CZJ5470NLV",
            "oem-1": "Xen",
            "oem-2": "MS_VM_CERT/SHA1/bdbeb6e0a816d43fa6d3fe8aaef04c2bad9d3e3d",
            "oem-3": "PSF:",
            "oem-4": "Product ID: 774435-425",
            "oem-5": "OEM String:",
            "hp-rombios": "COMPAQ",
        },
        power_on_mode: "",
        power_on_config: {},
        local_cache_sr: "OpaqueRef:NULL",
        chipset_info: { iommu: "true" },
        PCIs: [
            "OpaqueRef:2c613936-e0d0-47bf-b35d-51cfdc44ccf3",
            "OpaqueRef:e4e196fe-d33f-456d-89ba-c4f91395be57",
            "OpaqueRef:f058f5ae-9416-4cde-8642-72680a4773ee",
            "OpaqueRef:eb27a594-5eb0-4b8f-b2ff-1661c6e91cda",
            "OpaqueRef:dab22f26-6468-4990-b448-fe3280443c50",
            "OpaqueRef:c1952eca-4978-4b69-80d0-a926aa85299b",
            "OpaqueRef:c0bb7bf0-7b0a-4533-9359-52680a006edf",
            "OpaqueRef:8da2f895-838e-47cd-b28c-8383c80f6541",
            "OpaqueRef:7dc463fa-1fe4-407a-aac4-086fd9968b5a",
            "OpaqueRef:5930abe4-f2b0-4812-ba14-742f97734e16",
            "OpaqueRef:4df8c925-9f78-4709-b4cb-472d5fcb5307",
            "OpaqueRef:2f1a0e47-5322-42cd-9428-66d9afe9b711",
            "OpaqueRef:271f23e3-4a40-45fa-ba8b-ddfdd595170a",
            "OpaqueRef:214f0c86-4128-4d82-817f-84f801ad85ea",
            "OpaqueRef:15c459f8-5023-4551-8fcf-d2ce9d3db0c3",
            "OpaqueRef:104dcd5d-3aa2-4712-a4dc-f0998bf6f399",
        ],
        PGPUs: ["OpaqueRef:4f6f66f5-49e2-4121-9b40-5623acbc97d7", "OpaqueRef:2ff6b7f3-7322-438b-b26b-cf9947730d41"],
        PUSBs: [],
        ssl_legacy: true,
        guest_VCPUs_params: {},
        display: "disabled",
        virtual_hardware_platform_versions: [0, 1, 2],
        control_domain: "OpaqueRef:558b2831-a404-459c-bc8b-b7f6fb338cf3",
        updates_requiring_reboot: [],
        features: [],
        iscsi_iqn: "iqn.2017-02.com.example:ebf89764",
        multipathing: false,
    },
};