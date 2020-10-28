<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Magento\Framework\Filesystem;

/**
 * Provides extension for Driver interface.
 *
 * @see DriverInterface
 *
 * @deprecated Method will be moved to DriverInterface
 * @see DriverInterface
 */
interface ExtendedDriverInterface extends DriverInterface
{
    /**
     * Retrieve file metadata.
     *
     * Implementation must return associative array with next keys:
     *
     * ```php
     * [
     *  'path',
     *  'dirname',
     *  'basename',
     *  'extension',
     *  'filename',
     *  'timestamp',
     *  'size',
     *  'mimetype',
    *  ];
     *
     * @param string $path Absolute path to file
     * @return array
     *
     * @deprecated Method will be moved to DriverInterface
     */
    public function getMetadata(string $path): array;
}
